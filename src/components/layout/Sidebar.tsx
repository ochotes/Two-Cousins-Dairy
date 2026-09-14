"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthActions } from "@convex-dev/auth/react";
import { SVGProps, useState } from "react";
import { cn } from "@/lib/utils";
import { ChangePasswordModal } from "@/components/layout/ChangePasswordModal";

function IconBase(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 shrink-0"
      {...props}
    />
  );
}

function DashboardIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <IconBase {...props}>
      <rect x="3" y="3" width="6" height="6" rx="1" />
      <rect x="11" y="3" width="6" height="6" rx="1" />
      <rect x="3" y="11" width="6" height="6" rx="1" />
      <rect x="11" y="11" width="6" height="6" rx="1" />
    </IconBase>
  );
}

function HerdIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <IconBase {...props}>
      <line x1="3" y1="5" x2="17" y2="5" />
      <line x1="3" y1="10" x2="17" y2="10" />
      <line x1="3" y1="15" x2="17" y2="15" />
    </IconBase>
  );
}

function VaccinationIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <IconBase {...props}>
      <path d="M13.5 2.5l4 4" />
      <path d="M15.8 4.8l-9 9-3.3 4.5 4.5-3.3 9-9z" />
      <path d="M9.5 8.5l2 2" />
      <path d="M7 11l2 2" />
    </IconBase>
  );
}

function BreedingIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <IconBase {...props}>
      <rect x="3" y="4" width="14" height="13" rx="1" />
      <line x1="3" y1="8" x2="17" y2="8" />
      <line x1="7" y1="2" x2="7" y2="5" />
      <line x1="13" y1="2" x2="13" y2="5" />
      <circle cx="10" cy="12.5" r="1.4" />
    </IconBase>
  );
}

function ArchiveIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <IconBase {...props}>
      <rect x="3" y="4" width="14" height="4" rx="1" />
      <path d="M4 8v7a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V8" />
      <line x1="8" y1="11" x2="12" y2="11" />
    </IconBase>
  );
}

const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: DashboardIcon },
  { href: "/herd", label: "Herd", icon: HerdIcon },
  { href: "/vaccinations", label: "Vaccinations", icon: VaccinationIcon },
  { href: "/breeding", label: "Breeding", icon: BreedingIcon },
  { href: "/archive", label: "Archive", icon: ArchiveIcon },
];

export function Sidebar() {
  const pathname = usePathname();
  const { signOut } = useAuthActions();
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);

  return (
    <aside className="flex h-screen w-56 shrink-0 flex-col border-r border-border">
      <div className="flex h-14 items-center border-b border-border px-5">
        <span className="text-sm font-semibold text-foreground">
          Two Cousins Dairy
        </span>
      </div>
      <nav className="flex-1 space-y-0.5 px-3 py-4">
        {NAV_ITEMS.map((item) => {
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          const ItemIcon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors",
                active
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <ItemIcon />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="space-y-0.5 border-t border-border p-3">
        <button
          onClick={() => setChangePasswordOpen(true)}
          className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          Change Password
        </button>
        <button
          onClick={() => void signOut()}
          className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          Sign out
        </button>
      </div>
      <ChangePasswordModal
        open={changePasswordOpen}
        onClose={() => setChangePasswordOpen(false)}
      />
    </aside>
  );
}
