"use client";
import { Tabs, TabsList } from "@/components/ui/tabs";
import { notFound, usePathname } from "next/navigation";
import { LoadingLink } from "@/context/LoadingContext";
import { ReactNode } from "react";

export const statuses: {
  value: string;
  displayName: string;
  color?: string;
}[] = [
  {
    value: "all",
    displayName: "جميع الطلبات",
    color: "",
  },
  {
    value: "pending",
    displayName: "قيد المعالجة",
    color: "text-rayanWarning-dark",
  },
  {
    value: "finished",
    displayName: "تمت",
    color: "text-sky-600",
  },
  {
    value: "rejected",
    displayName: "مرفوضة",
    color: "text-pink-700",
  },
  {
    value: "canceled",
    displayName: "ملغية",
    color: "text-destructive",
  },
];

export default function OrdersTabs() {
  const pathname = usePathname();

  if (!statuses.some((status) => pathname.includes(status.value)))
    return notFound();

  return (
    <header className="mt-4 bg-inherit p-2 text-center" dir="rtl">
      <div>
        {statuses.map((status) => (
          <TabLink
            key={status.value}
            className={`rounded-lg text-sm sm:text-xl ${
              pathname.includes(status.value) &&
              `text-md bg-background ${status.color} shadow-sm sm:text-2xl`
            }`}
            href={`/orders/${status.value}`}
          >
            {status.displayName}
          </TabLink>
        ))}
      </div>
    </header>
  );
}

function TabLink({
  href,
  children,
  className,
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  const pathname = usePathname();
  return (
    <LoadingLink
      href={href}
      className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${className}`}
    >
      {children}
    </LoadingLink>
  );
}
