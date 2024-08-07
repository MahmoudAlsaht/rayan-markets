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
  const user = await checkUser() as {
    id: string;
    phone: string;
    username: string;
    role: string;
    profile: { id: string };
  };
  return (
    <main dir="rtl">
      <MainNavbar user={user} />
      {children}
      <main className="sm:hidden">
        <BottomNavbar />
      </main>
    </main>
  );
}
