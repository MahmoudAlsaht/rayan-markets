"use client";
import { ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

export function OptionLink({
  href,
  icon,
  displayName,
  handleClick,
}: {
  href: string;
  icon: ReactNode;
  displayName: string;
  handleClick?: () => Promise<void>;
}) {
  const router = useRouter();

  return (
    <Link
      href={href}
      className={cn(
        "flex px-4 py-3 hover:bg-rayanPrimary-light hover:text-black",
      )}
      onClick={async () => {
        if (handleClick) await handleClick();
        router.refresh();
      }}
    >
      <span className="ml-4">{icon}</span>
      {displayName}
    </Link>
  );
}
