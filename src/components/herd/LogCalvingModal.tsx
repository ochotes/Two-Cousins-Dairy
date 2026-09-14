"use client";

import { FormEvent, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import { Id } from "@convex/_generated/dataModel";
import { Modal } from "@/components/ui/Modal";
import { Field, inputClass } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { dateInputToTs, todayDateInput } from "@/lib/dates";

type Outcome = "live" | "stillborn" | "aborted";
type Sex = "male" | "female";

export function LogCalvingModal({
  open,
  onClose,
  cowId,
}: {
  open: boolean;
  onClose: () => void;
  cowId: Id<"cows">;
}) {
  const addCalving = useMutation(api.breeding.addCalving);
  const [date, setDate] = useState(todayDateInput());
  const [outcome, setOutcome] = useState<Outcome>("live");
  const [calfTagNumber, setCalfTagNumber] = useState("");
  const [calfSex, setCalfSex] = useState<Sex | "">("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await addCalving({
        cowId,
        date: dateInputToTs(date)!,
        outcome,
        calfTagNumber: calfTagNumber || undefined,
        calfSex: calfSex || undefined,
        notes: notes || undefined,
      });
      setDate(todayDateInput());
      setOutcome("live");
      setCalfTagNumber("");
      setCalfSex("");
      setNotes("");
      onClose();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Log Calving">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Date">
          <input
            required
            type="date"
            max={todayDateInput()}
            className={inputClass}
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </Field>
        <Field label="Outcome">
          <select
            className={inputClass}
            value={outcome}
            onChange={(e) => setOutcome(e.target.value as Outcome)}
          >
            <option value="live">Live</option>
            <option value="stillborn">Stillborn</option>
            <option value="aborted">Aborted</option>
          </select>
        </Field>
        <Field label="Calf Tag Number" hint="Optional">
          <input
            className={`${inputClass} font-mono`}
            value={calfTagNumber}
            onChange={(e) => setCalfTagNumber(e.target.value)}
          />
        </Field>
        <Field label="Calf Sex" hint="Optional">
          <select
            className={inputClass}
            value={calfSex}
            onChange={(e) => setCalfSex(e.target.value as Sex | "")}
          >
            <option value="">—</option>
            <option value="female">Female</option>
            <option value="male">Male</option>
          </select>
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
          {submitting ? "Saving…" : "Log Calving"}
        </Button>
      </form>
    </Modal>
  );
}
