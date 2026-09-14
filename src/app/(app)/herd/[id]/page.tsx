import { CowProfile } from "@/components/herd/CowProfile";
import { Id } from "@convex/_generated/dataModel";

export default async function CowProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <CowProfile id={id as Id<"cows">} />;
}
