import { ReactNode } from "react";

export default async function SiteFacingLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <main dir="rtl">
      {children}
      <div className="h-24"></div>
    </main>
  );
}
