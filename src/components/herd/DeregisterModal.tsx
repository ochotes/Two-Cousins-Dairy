"use client";

import { FormEvent, useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Field, inputClass } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";

export function DeregisterModal({
  open,
  onClose,
  onConfirm,
  cowName,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => Promise<void>;
  cowName: string;
}) {
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onConfirm(reason);
      setReason("");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={`Deregister ${cowName}?`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <p className="text-sm text-subtle-foreground">
          This moves {cowName} to the Archive. Her records are kept, not
          deleted, and she can be reactivated later by editing her status.
        </p>
        <Field label="Reason" hint="Optional">
          <textarea
            rows={2}
            className={inputClass}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </Field>
        <Button
          type="submit"
          variant="danger"
          disabled={submitting}
          className="w-full"
        >
          {submitting ? "Deregistering…" : "Deregister"}
        </Button>
      </form>
    </Modal>
  );
}
