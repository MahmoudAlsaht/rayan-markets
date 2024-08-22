import { ReactNode } from "react";
import { isAuthorizedUser } from "../(siteFacing)/auth/_actions/isAdmin";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  await isAuthorizedUser();
  return (
    <main dir="rtl" className="h-screen bg-slate-200 pb-10">
      {children}
    </main>
  );
}
