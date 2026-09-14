"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import { Field, inputClass } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { todayDateInput } from "@/lib/dates";
import { CowStatus, STATUS_LABELS } from "@/components/ui/StatusBadge";
import { cn } from "@/lib/utils";

export type CowFormValues = {
  tagNumber: string;
  name: string;
  dateOfBirth: string;
  breed: string;
  sireName: string;
  damName: string;
  status: CowStatus;
  notes: string;
};

const DEFAULT_VALUES: CowFormValues = {
  tagNumber: "",
  name: "",
  dateOfBirth: "",
  breed: "",
  sireName: "",
  damName: "",
  status: "heifer",
  notes: "",
};

const STATUS_OPTIONS: CowStatus[] = [
  "heifer",
  "milking",
  "dry",
  "pregnant",
  "deregistered",
];

export function CowForm({
  initialValues,
  initialPhotoUrl,
  submitLabel,
  submitting,
  onSubmit,
}: {
  initialValues?: Partial<CowFormValues>;
  initialPhotoUrl?: string | null;
  submitLabel: string;
  submitting: boolean;
  onSubmit: (values: CowFormValues, photoFile: File | null) => void;
}) {
  const [values, setValues] = useState<CowFormValues>({
    ...DEFAULT_VALUES,
    ...initialValues,
  });
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(
    initialPhotoUrl ?? null,
  );

  function update<K extends keyof CowFormValues>(
    key: K,
    value: CowFormValues[K],
  ) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  function handlePhotoChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setPhotoFile(file);
    if (file) setPhotoPreview(URL.createObjectURL(file));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSubmit(values, photoFile);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-border bg-muted">
          {photoPreview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={photoPreview}
              alt=""
              className="h-full w-full object-cover"
            />
          ) : null}
        </div>
        <label className="cursor-pointer text-sm text-accent hover:opacity-80">
          {photoPreview ? "Change photo" : "Upload photo"}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handlePhotoChange}
          />
        </label>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Name">
          <input
            required
            className={inputClass}
            value={values.name}
            onChange={(e) => update("name", e.target.value)}
          />
        </Field>
        <Field label="Tag Number">
          <input
            required
            className={cn(inputClass, "font-mono")}
            value={values.tagNumber}
            onChange={(e) => update("tagNumber", e.target.value)}
          />
        </Field>
        <Field label="Date of Birth">
          <input
            type="date"
            max={todayDateInput()}
            className={inputClass}
            value={values.dateOfBirth}
            onChange={(e) => update("dateOfBirth", e.target.value)}
          />
        </Field>
        <Field label="Breed">
          <input
            className={inputClass}
            value={values.breed}
            onChange={(e) => update("breed", e.target.value)}
          />
        </Field>
        <Field label="Sire">
          <input
            className={inputClass}
            value={values.sireName}
            onChange={(e) => update("sireName", e.target.value)}
          />
        </Field>
        <Field label="Dam">
          <input
            className={inputClass}
            value={values.damName}
            onChange={(e) => update("damName", e.target.value)}
          />
        </Field>
        <Field label="Status">
          <select
            className={inputClass}
            value={values.status}
            onChange={(e) => update("status", e.target.value as CowStatus)}
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {STATUS_LABELS[s]}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Notes">
        <textarea
          rows={4}
          className={inputClass}
          value={values.notes}
          onChange={(e) => update("notes", e.target.value)}
        />
      </Field>

      <Button type="submit" variant="primary" disabled={submitting}>
        {submitting ? "Saving…" : submitLabel}
      </Button>
    </form>
  );
}
