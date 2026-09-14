"use client";

import { FormEvent, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import { Id } from "@convex/_generated/dataModel";
import { Modal } from "@/components/ui/Modal";
import { Field, inputClass } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { dateInputToTs, todayDateInput } from "@/lib/dates";

export function LogVaccinationModal({
  open,
  onClose,
  cowId,
}: {
  open: boolean;
  onClose: () => void;
  cowId: Id<"cows">;
}) {
  const addVaccination = useMutation(api.vaccinations.add);
  const [vaccine, setVaccine] = useState("");
  const [date, setDate] = useState(todayDateInput());
  const [nextDue, setNextDue] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await addVaccination({
        cowId,
        date: dateInputToTs(date)!,
        vaccine,
        nextDue: dateInputToTs(nextDue),
        notes: notes || undefined,
      });
      setVaccine("");
      setNextDue("");
      setNotes("");
      setDate(todayDateInput());
      onClose();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Log Vaccination">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Vaccine">
          <input
            required
            className={inputClass}
            value={vaccine}
            onChange={(e) => setVaccine(e.target.value)}
          />
        </Field>
        <Field label="Date Given">
          <input
            required
            type="date"
            max={todayDateInput()}
            className={inputClass}
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </Field>
        <Field label="Next Due" hint="Optional">
          <input
            type="date"
            className={inputClass}
            value={nextDue}
            onChange={(e) => setNextDue(e.target.value)}
          />
        </Field>
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
          {submitting ? "Saving…" : "Log Vaccination"}
        </Button>
      </form>
    </Modal>
  );
}
