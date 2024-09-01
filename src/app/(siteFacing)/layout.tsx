import { ReactNode } from "react";

export const dynamic = "force-dynamic";

export default async function SiteFacingLayout({
  children,
  privacyPolicy,
}: {
  children: ReactNode;
  privacyPolicy: ReactNode;
}) {
  return (
    <main dir="rtl">
      {privacyPolicy}
      {children}
      <div className="h-24"></div>
    </main>
  );
}
