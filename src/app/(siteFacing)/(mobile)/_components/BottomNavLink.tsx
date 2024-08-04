"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ComponentProps, ReactNode } from "react";

export default function BottomNavLink({
  href = "#",
  icon,
  title,
}: {
  href?: string;
  icon?: ReactNode;
  title: string | ReactNode;
}) {
  const pathname = usePathname();

  return (
    <NavLink href={href}>
      {icon}
      {typeof title !== "string" && title}
      {pathname === href && <span className="text-xs">{title}</span>}
    </NavLink>
  );
}

function NavLink(props: Omit<ComponentProps<typeof Link>, "classNameName">) {
  const pathname = usePathname();

  return (
    <Link
      replace
      {...props}
      className={cn(
        "group inline-flex flex-col items-center justify-center px-5",
        pathname === props.href &&
          `bg-gray-100 text-rayanPrimary-dark ${
            pathname === "/options" && "rounded-e-full"
          } ${pathname === "/" && "rounded-s-full"}`,
      )}
    />
  );
}
