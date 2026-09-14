"use client";

import { FormEvent, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import { Id } from "@convex/_generated/dataModel";
import { Modal } from "@/components/ui/Modal";
import { Field, inputClass } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { dateInputToTs, todayDateInput } from "@/lib/dates";

export function LogHeatModal({
  open,
  onClose,
  cowId,
}: {
  open: boolean;
  onClose: () => void;
  cowId: Id<"cows">;
}) {
  const addHeat = useMutation(api.breeding.addHeat);
  const [date, setDate] = useState(todayDateInput());
  const [serviced, setServiced] = useState(false);
  const [serviceDate, setServiceDate] = useState(todayDateInput());
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await addHeat({
        cowId,
        date: dateInputToTs(date)!,
        serviced,
        serviceDate: serviced ? dateInputToTs(serviceDate) : undefined,
        notes: notes || undefined,
      });
      setDate(todayDateInput());
      setServiced(false);
      setNotes("");
      onClose();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Log Heat">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Date Observed">
          <input
            required
            type="date"
            max={todayDateInput()}
            className={inputClass}
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </Field>
        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          <input
            type="checkbox"
            checked={serviced}
            onChange={(e) => setServiced(e.target.checked)}
            className="h-4 w-4 accent-accent"
          />
          Serviced
        </label>
        {serviced && (
          <Field label="Service Date">
            <input
              type="date"
              max={todayDateInput()}
              className={inputClass}
              value={serviceDate}
              onChange={(e) => setServiceDate(e.target.value)}
            />
          </Field>
        )}
        <Field label="Notes" hint="Optional">
          <textarea
            rows={2}
            className={inputClass}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </Field>
        <Button
          type="submit"
          variant="primary"
          disabled={submitting}
          className="w-full"
        >
          {submitting ? "Saving…" : "Log Heat"}
        </Button>
      </form>
    </Modal>
  );
}
