import { ReactNode } from "react";

export const dynamic =
  process.env.NODE_ENV === "development" ? "force-dynamic" : "auto";

export default async function SiteFacingLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <main dir="rtl">{children}</main>;
}
