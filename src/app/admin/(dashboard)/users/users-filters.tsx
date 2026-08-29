"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { roleLabels, type AppRole } from "@/lib/constants";
import { cn } from "@/lib/utils";

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-full border px-3 py-1.5 text-sm transition-all",
        active
          ? "border-algeria-green bg-algeria-green font-semibold text-algeria-green-foreground"
          : "border-border bg-card hover:border-algeria-green/50 hover:bg-muted",
      )}
    >
      {children}
    </button>
  );
}

export function UsersFilters({ roles }: { roles: AppRole[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentRole = searchParams.get("role");

  function toggle(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (params.get("role") === value) params.delete("role");
    else params.set("role", value);
    router.push(params.toString() ? `${pathname}?${params}` : pathname, { scroll: false });
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {roles.map((r) => (
        <Chip key={r} active={currentRole === r} onClick={() => toggle(r)}>
          {roleLabels[r]}
        </Chip>
      ))}
      {currentRole && (
        <Button variant="ghost" size="sm" onClick={() => router.push(pathname, { scroll: false })}>
          <X className="size-4" /> مسح الفلتر
        </Button>
      )}
    </div>
  );
}
