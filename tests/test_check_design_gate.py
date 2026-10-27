"""Regression checks for review verdicts, not for aesthetic judgment."""

import copy
import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "skills/ui-foundry/scripts"))

from check_design_gate import REQUIRED, check

ROOT = Path(__file__).resolve().parents[1]
SCRIPT = ROOT / "skills/ui-foundry/scripts/check_design_gate.py"


class DesignGateTests(unittest.TestCase):
    def setUp(self):
        self.review = {
            "scope": "Fictional UI validation",
            "reviewer": "Independent read-only review",
            "independent": True,
            "iteration": 1,
            "checks": [
                {"id": key, "status": "pass", "evidence": ["Observed test fixture"]}
                for key in sorted(REQUIRED)
            ],
        }

    def test_complete_record_reports_authored_verdict_without_certifying_quality(self):
        result = check(self.review)
        self.assertTrue(result["record_valid"])
        self.assertEqual(result["reported_verdict"], "PASS")
        self.assertFalse(result["quality_verified_by_script"])
        self.assertNotIn("verdict", result)

    def test_failed_gate_cannot_be_averaged_away(self):
        self.review["checks"][0]["status"] = "rework"
        result = check(self.review)
        self.assertEqual(result["reported_verdict"], "REWORK")
        self.assertEqual(result["next"], "repair_and_recheck")

    def test_missing_execution_is_not_a_pass(self):
        self.review["checks"][0]["status"] = "unverified"
        self.assertEqual(check(self.review)["reported_verdict"], "UNVERIFIED")

    def test_empty_evidence_and_duplicate_gates_are_invalid(self):
        missing = copy.deepcopy(self.review)
        missing["checks"][0]["evidence"] = []
        with self.assertRaises(ValueError):
            check(missing)
        self.review["checks"][0] = copy.deepcopy(self.review["checks"][1])
        with self.assertRaises(ValueError):
            check(self.review)

    def test_third_failed_round_requires_reassessment_and_continued_repair(self):
        self.review["iteration"] = 3
        self.review["checks"][0]["status"] = "rework"
        result = check(self.review)
        self.assertEqual(result["next"], "repair_and_recheck")
        self.assertTrue(result["strategy_review_due"])
        self.assertEqual(result["reported_verdict"], "REWORK")

    def test_later_repair_can_pass_without_resetting_history(self):
        self.review["iteration"] = 4
        result = check(self.review)
        self.assertEqual(result["reported_verdict"], "PASS")
        self.assertFalse(result["strategy_review_due"])

    def test_later_missing_evidence_requires_observation_not_halt(self):
        self.review["iteration"] = 4
        self.review["checks"][0]["status"] = "unverified"
        self.assertEqual(check(self.review)["next"], "obtain_missing_evidence")

    def test_iteration_must_be_a_positive_integer(self):
        for value in (0, -1, 1.5, True):
            with self.subTest(value=value):
                self.review["iteration"] = value
                with self.assertRaises(ValueError):
                    check(self.review)

    def test_all_inapplicable_cannot_pass(self):
        for item in self.review["checks"]:
            item["status"] = "not_applicable"
        with self.assertRaises(ValueError):
            check(self.review)

    def test_cli_rejects_duplicate_root_json_member(self):
        payload = '{"scope":"superseded",' + json.dumps(self.review)[1:]
        result = self.run_cli(payload)
        self.assertEqual(result.returncode, 1)
        self.assertEqual(json.loads(result.stdout)["record_valid"], False)
        self.assertIn("Duplicate JSON key: scope", result.stdout)

    def test_cli_rejects_duplicate_nested_json_member(self):
        payload = json.dumps(self.review).replace(
            '"status": "pass"', '"status": "rework", "status": "pass"', 1
        )
        result = self.run_cli(payload)
        self.assertEqual(result.returncode, 1)
        self.assertEqual(json.loads(result.stdout)["record_valid"], False)
        self.assertIn("Duplicate JSON key: status", result.stdout)

    def test_cli_returns_error_json_for_unhashable_ids_and_statuses(self):
        for field, value in (("id", ["claims"]), ("status", ["pass"])):
            with self.subTest(field=field):
                review = copy.deepcopy(self.review)
                review["checks"][0][field] = value
                result = self.run_cli(json.dumps(review))
                self.assertEqual(result.returncode, 1)
                response = json.loads(result.stdout)
                self.assertFalse(response["record_valid"])
                self.assertIn("error", response)
                self.assertEqual(result.stderr, "")

    def run_cli(self, payload):
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "review.json"
            path.write_text(payload, encoding="utf-8")
            return subprocess.run(
                [sys.executable, str(SCRIPT), str(path)], capture_output=True, text=True, check=False
            )


if __name__ == "__main__":
    unittest.main()
