import { ReactNode } from "react";

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
