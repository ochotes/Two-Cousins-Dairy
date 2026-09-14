import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { HerdTable } from "@/components/herd/HerdTable";

export default function HerdPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Herd</h1>
          <p className="mt-1 text-sm text-subtle-foreground">
            All active animals in the herd.
          </p>
        </div>
        <Link href="/herd/new">
          <Button variant="primary">Add Cow</Button>
        </Link>
      </div>
      <HerdTable />
    </div>
  );
}
