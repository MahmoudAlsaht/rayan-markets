import { ReactNode } from "react";
import QueryProvider from "./products/_components/QueryProvider";

// export const dynamic = "force-dynamic";

export default async function SiteFacingLayout({
  children,
  privacyPolicy,
}: {
  children: ReactNode;
  privacyPolicy: ReactNode;
}) {
  return (
    <QueryProvider>
      <main dir="rtl">
        {privacyPolicy}
        {children}
        <div className="h-24"></div>
      </main>
    </QueryProvider>
  );
}
