import { Button, Input, Label, Modal, TextField } from "@heroui/react";
import { useRef, useState } from "react";
import { createRoot } from "react-dom/client";

import "./styles.css";

function App() {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [name, setName] = useState("Mira Chen");
  const [draftName, setDraftName] = useState(name);
  const [isOpen, setIsOpen] = useState(false);
  const [saved, setSaved] = useState(false);

  function openEditor() {
    setDraftName(name);
    setSaved(false);
    setIsOpen(true);
  }

  function handleOpenChange(open: boolean) {
    setIsOpen(open);
    if (!open) window.setTimeout(() => triggerRef.current?.focus(), 0);
  }

  function save(close: () => void) {
    const value = draftName.trim();
    if (!value) return;
    setName(value);
    setSaved(true);
    close();
  }

  return (
    <main className="fixture-shell">
      <section aria-labelledby="fixture-title" className="fixture-card">
        <div className="fixture-eyebrow">HeroUI v3 adapter fixture</div>
        <div className="fixture-heading">
          <div>
            <h1 id="fixture-title">Member profile</h1>
            <p>Small, fictional interaction for validating component plumbing.</p>
          </div>
          <span aria-label="Selected member" className="selected-state">Selected</span>
        </div>

        <div className="member-row">
          <div aria-hidden="true" className="avatar">{name.slice(0, 1)}</div>
          <div className="member-copy">
            <span className="member-label">Display name</span>
            <strong data-testid="saved-name">{name}</strong>
          </div>
          <Button ref={triggerRef} onPress={openEditor} variant="outline">
            Edit name
          </Button>
        </div>

        <p aria-live="polite" className="save-feedback" data-testid="save-feedback">
          {saved ? `${name} saved for this fixture session.` : "No changes saved yet."}
        </p>
      </section>

      <Modal>
        <Modal.Backdrop isOpen={isOpen} onOpenChange={handleOpenChange} variant="opaque">
          <Modal.Container placement="center" size="sm">
            <Modal.Dialog aria-labelledby="edit-name-heading">
              {(dialog) => (
                <>
                  <Modal.Header>
                    <Modal.Heading id="edit-name-heading">Edit display name</Modal.Heading>
                  </Modal.Header>
                  <Modal.Body>
                    <TextField className="name-field" value={draftName} onChange={setDraftName}>
                      <Label>Display name</Label>
                      <Input autoFocus fullWidth name="display-name" placeholder="Enter a display name" />
                    </TextField>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button slot="close" variant="tertiary">Cancel</Button>
                    <Button isDisabled={!draftName.trim()} onPress={() => save(dialog.close)}>Save name</Button>
                  </Modal.Footer>
                </>
              )}
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>
    </main>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
