import { ReactNode } from "react";
import MainNavbar from "./_components/MainNavbar";
import { checkUser } from "./auth/_actions/isAuthenticated";
import BottomNavbar from "./(mobile)/_components/BottomNavbar";
import BackButtonNav from "@/components/BackButtonNav";

export default async function SiteFacingLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await checkUser();
  return (
    <main dir="rtl">
      <MainNavbar user={user} />
      <div></div>
      {children}
      <main className="sm:hidden">
        <BottomNavbar />
      </main>
    </main>
  );
}
