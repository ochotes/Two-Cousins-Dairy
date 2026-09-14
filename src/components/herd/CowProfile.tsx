"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { Id } from "@convex/_generated/dataModel";
import { Card } from "@/components/ui/Card";
import { FlashCard } from "@/components/ui/FlashCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { CowForm, CowFormValues } from "@/components/herd/CowForm";
import { LogVaccinationModal } from "@/components/herd/LogVaccinationModal";
import { LogHeatModal } from "@/components/herd/LogHeatModal";
import { LogCalvingModal } from "@/components/herd/LogCalvingModal";
import { DeregisterModal } from "@/components/herd/DeregisterModal";
import {
  formatAge,
  formatDate,
  nextExpectedHeat,
  expectedCalvingDate,
  isOverdue,
  dateInputToTs,
  tsToDateInput,
} from "@/lib/dates";
import { cn } from "@/lib/utils";

export function CowProfile({ id }: { id: Id<"cows"> }) {
  const cow = useQuery(api.cows.getProfile, { id });

  const updateCow = useMutation(api.cows.update);
  const deregisterCow = useMutation(api.cows.deregister);
  const generateUploadUrl = useMutation(api.cows.generateUploadUrl);

  const [editOpen, setEditOpen] = useState(false);
  const [vaccOpen, setVaccOpen] = useState(false);
  const [heatOpen, setHeatOpen] = useState(false);
  const [calvingOpen, setCalvingOpen] = useState(false);
  const [deregisterOpen, setDeregisterOpen] = useState(false);
  const [savingEdit, setSavingEdit] = useState(false);

  if (cow === undefined) {
    return <p className="text-sm text-subtle-foreground">Loading…</p>;
  }
  if (cow === null) {
    return <p className="text-sm text-subtle-foreground">Cow not found.</p>;
  }

  const nextHeat = nextExpectedHeat(cow.heatEvents);
  const nextCalving = expectedCalvingDate(cow.heatEvents);

  async function handleEditSubmit(
    values: CowFormValues,
    photoFile: File | null,
  ) {
    setSavingEdit(true);
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
      await updateCow({
        id,
        tagNumber: values.tagNumber,
        name: values.name,
        dateOfBirth: dateInputToTs(values.dateOfBirth),
        breed: values.breed || undefined,
        sireName: values.sireName || undefined,
        damName: values.damName || undefined,
        status: values.status,
        notes: values.notes || undefined,
        ...(photoId ? { photoId } : {}),
      });
      setEditOpen(false);
    } finally {
      setSavingEdit(false);
    }
  }

  async function handleDeregister(reason: string) {
    await deregisterCow({ id, reason: reason || undefined });
    setDeregisterOpen(false);
  }

  return (
    <div className="space-y-8">
      <FlashCard key={cow.updatedAt} flashKey={cow.updatedAt} className="p-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex gap-4">
            <div className="h-24 w-24 shrink-0 overflow-hidden rounded-lg border border-border bg-muted">
              {cow.photoUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={cow.photoUrl}
                  alt=""
                  className="h-full w-full object-cover"
                />
              )}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-xl font-semibold text-foreground">
                  {cow.name}
                </h1>
                <StatusBadge status={cow.status} />
              </div>
              <p className="mt-1 font-mono text-sm text-muted-foreground">
                #{cow.tagNumber}
              </p>
              <dl className="mt-3 grid grid-cols-2 gap-x-6 gap-y-1.5 text-sm sm:grid-cols-3">
                <div>
                  <dt className="text-xs uppercase text-subtle-foreground">
                    Age
                  </dt>
                  <dd className="font-mono text-muted-foreground">
                    {formatAge(cow.dateOfBirth)}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs uppercase text-subtle-foreground">
                    Born
                  </dt>
                  <dd className="font-mono text-muted-foreground">
                    {formatDate(cow.dateOfBirth)}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs uppercase text-subtle-foreground">
                    Breed
                  </dt>
                  <dd className="text-muted-foreground">
                    {cow.breed ?? "—"}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs uppercase text-subtle-foreground">
                    Sire
                  </dt>
                  <dd className="text-muted-foreground">
                    {cow.sireName ?? "—"}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs uppercase text-subtle-foreground">
                    Dam
                  </dt>
                  <dd className="text-muted-foreground">
                    {cow.damName ?? "—"}
                  </dd>
                </div>
                {cow.heiferEnteredAt && (
                  <div>
                    <dt className="text-xs uppercase text-subtle-foreground">
                      Heifer Since
                    </dt>
                    <dd className="font-mono text-muted-foreground">
                      {formatDate(cow.heiferEnteredAt)}
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          </div>
          <div className="flex shrink-0 gap-2">
            <Button variant="secondary" onClick={() => setEditOpen(true)}>
              Edit
            </Button>
            {cow.status !== "deregistered" && (
              <Button
                variant="danger"
                onClick={() => setDeregisterOpen(true)}
              >
                Deregister
              </Button>
            )}
          </div>
        </div>
      </FlashCard>

      {cow.status !== "deregistered" &&
        ((nextHeat && cow.status !== "pregnant") || nextCalving) && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {nextHeat && cow.status !== "pregnant" && (
              <Card className="p-4">
                <div className="text-xs uppercase tracking-wide text-subtle-foreground">
                  Next Expected Heat
                </div>
                <div
                  className={cn(
                    "mt-1 font-mono text-lg",
                    isOverdue(nextHeat) ? "text-danger" : "text-foreground",
                  )}
                >
                  {formatDate(nextHeat)}
                </div>
              </Card>
            )}
            {nextCalving && (
              <Card className="p-4">
                <div className="text-xs uppercase tracking-wide text-subtle-foreground">
                  Expected Calving
                </div>
                <div
                  className={cn(
                    "mt-1 font-mono text-lg",
                    isOverdue(nextCalving) ? "text-danger" : "text-foreground",
                  )}
                >
                  {formatDate(nextCalving)}
                </div>
              </Card>
            )}
          </div>
        )}

      {cow.notes && (
        <Card className="p-5">
          <h2 className="mb-2 text-sm font-semibold text-foreground">
            Notes
          </h2>
          <p className="whitespace-pre-wrap text-sm text-muted-foreground">
            {cow.notes}
          </p>
        </Card>
      )}

      <Card className="p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">
            Vaccinations
          </h2>
          <Button variant="secondary" onClick={() => setVaccOpen(true)}>
            Log Vaccination
          </Button>
        </div>
        {cow.vaccinations.length === 0 ? (
          <p className="text-sm text-subtle-foreground">
            No vaccination records.
          </p>
        ) : (
          <ul className="divide-y divide-border">
            {cow.vaccinations.map((v) => (
              <li
                key={v._id}
                className="flex flex-wrap items-center justify-between gap-2 py-2.5 text-sm"
              >
                <div>
                  <span className="text-foreground">{v.vaccine}</span>
                  {v.notes && (
                    <span className="ml-2 text-subtle-foreground">
                      {v.notes}
                    </span>
                  )}
                </div>
                <div className="flex gap-4 font-mono text-xs">
                  <span className="text-muted-foreground">
                    {formatDate(v.date)}
                  </span>
                  {v.nextDue && (
                    <span
                      className={
                        isOverdue(v.nextDue)
                          ? "text-danger"
                          : "text-muted-foreground"
                      }
                    >
                      Next: {formatDate(v.nextDue)}
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Card className="p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">
            Heat / Estrus Log
          </h2>
          <Button variant="secondary" onClick={() => setHeatOpen(true)}>
            Log Heat
          </Button>
        </div>
        {cow.heatEvents.length === 0 ? (
          <p className="text-sm text-subtle-foreground">
            No heat events logged.
          </p>
        ) : (
          <ul className="divide-y divide-border">
            {cow.heatEvents.map((h) => (
              <li
                key={h._id}
                className="flex flex-wrap items-center justify-between gap-2 py-2.5 text-sm"
              >
                <div>
                  <span className="text-foreground">Heat observed</span>
                  {h.serviced && (
                    <span className="ml-2 text-subtle-foreground">
                      Serviced
                      {h.serviceDate ? ` on ${formatDate(h.serviceDate)}` : ""}
                    </span>
                  )}
                  {h.notes && (
                    <span className="ml-2 text-subtle-foreground">
                      {h.notes}
                    </span>
                  )}
                </div>
                <span className="font-mono text-xs text-muted-foreground">
                  {formatDate(h.date)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Card className="p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">
            Calving History
          </h2>
          <Button variant="secondary" onClick={() => setCalvingOpen(true)}>
            Log Calving
          </Button>
        </div>
        {cow.calvings.length === 0 ? (
          <p className="text-sm text-subtle-foreground">
            No calving records.
          </p>
        ) : (
          <ul className="divide-y divide-border">
            {cow.calvings.map((c) => (
              <li
                key={c._id}
                className="flex flex-wrap items-center justify-between gap-2 py-2.5 text-sm"
              >
                <div>
                  <span className="capitalize text-foreground">
                    {c.outcome}
                  </span>
                  {c.calfTagNumber && (
                    <span className="ml-2 font-mono text-xs text-subtle-foreground">
                      Calf #{c.calfTagNumber}
                    </span>
                  )}
                  {c.calfSex && (
                    <span className="ml-2 capitalize text-subtle-foreground">
                      {c.calfSex}
                    </span>
                  )}
                </div>
                <span className="font-mono text-xs text-muted-foreground">
                  {formatDate(c.date)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Edit Cow">
        <CowForm
          submitLabel="Save Changes"
          submitting={savingEdit}
          initialPhotoUrl={cow.photoUrl}
          initialValues={{
            tagNumber: cow.tagNumber,
            name: cow.name,
            dateOfBirth: tsToDateInput(cow.dateOfBirth),
            breed: cow.breed ?? "",
            sireName: cow.sireName ?? "",
            damName: cow.damName ?? "",
            status: cow.status,
            notes: cow.notes ?? "",
          }}
          onSubmit={handleEditSubmit}
        />
      </Modal>

      <LogVaccinationModal
        open={vaccOpen}
        onClose={() => setVaccOpen(false)}
        cowId={id}
      />
      <LogHeatModal
        open={heatOpen}
        onClose={() => setHeatOpen(false)}
        cowId={id}
      />
      <LogCalvingModal
        open={calvingOpen}
        onClose={() => setCalvingOpen(false)}
        cowId={id}
      />
      <DeregisterModal
        open={deregisterOpen}
        onClose={() => setDeregisterOpen(false)}
        onConfirm={handleDeregister}
        cowName={cow.name}
      />
    </div>
  );
}
