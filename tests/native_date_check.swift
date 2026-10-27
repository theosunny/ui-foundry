import Foundation

@main
struct NativeDateCheck {
	static func main() {
		precondition(CivilDate(year: 2026, month: 2, day: 30) == nil, "Invalid February 30 was normalized")
		precondition(CivilDate(year: 2025, month: 2, day: 29) == nil, "Invalid non-leap day was accepted")
		precondition(CivilDate(year: 2024, month: 2, day: 29) != nil, "Valid leap day was rejected")

		let zones = ["Asia/Shanghai", "America/Los_Angeles", "Pacific/Kiritimati"]
		guard let saved = CivilDate(year: 2026, month: 10, day: 27) else {
			fatalError("Expected valid Gregorian date")
		}
		for identifier in zones {
			guard let zone = TimeZone(identifier: identifier) else { fatalError("Missing time zone: \(identifier)") }
			for identifier in [Calendar.Identifier.gregorian, .buddhist, .japanese] {
				var displayCalendar = Calendar(identifier: identifier)
				// This intentionally differs from `zone`: the SwiftUI environment can
				// override a calendar's time zone for the picker.
				displayCalendar.timeZone = TimeZone(secondsFromGMT: 0) ?? .current
				let dateForPicker = saved.date(in: displayCalendar, timeZone: zone)
				let roundTrip = CivilDate(date: dateForPicker, displayCalendar: displayCalendar, timeZone: zone)
				precondition(roundTrip == saved, "Lost saved civil date in \(zone.identifier) / \(identifier)")
			}
		}
		print("native_date_check: 12/12 passed")
	}
}
