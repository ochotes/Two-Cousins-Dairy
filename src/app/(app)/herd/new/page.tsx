"use client";

import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "@convex/_generated/api";
import { Id } from "@convex/_generated/dataModel";
import { CowForm, CowFormValues } from "@/components/herd/CowForm";
import { dateInputToTs } from "@/lib/dates";

export default function NewCowPage() {
  const router = useRouter();
  const createCow = useMutation(api.cows.create);
  const generateUploadUrl = useMutation(api.cows.generateUploadUrl);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(values: CowFormValues, photoFile: File | null) {
    setSubmitting(true);
    setError(null);
    try {
      let photoId: Id<"_storage"> | undefined;
      if (photoFile) {
        const uploadUrl = await generateUploadUrl();
        const res = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": photoFile.type },
          body: photoFile,
        });
        const json = await res.json();
        photoId = json.storageId as Id<"_storage">;
      }
      const id = await createCow({
        tagNumber: values.tagNumber,
        name: values.name,
        dateOfBirth: dateInputToTs(values.dateOfBirth),
        breed: values.breed || undefined,
        sireName: values.sireName || undefined,
        damName: values.damName || undefined,
        status: values.status,
        notes: values.notes || undefined,
        photoId,
      });
      router.push(`/herd/${id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-foreground">Add Cow</h1>
        <p className="mt-1 text-sm text-subtle-foreground">
          Register a new animal in the herd.
        </p>
      </div>
      {error && (
        <p className="rounded-md border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger">
          {error}
        </p>
      )}
      <CowForm
        submitLabel="Add Cow"
        submitting={submitting}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
