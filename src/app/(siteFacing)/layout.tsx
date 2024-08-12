import { ReactNode } from "react";
import MainNavbar from "./_components/MainNavbar";
import { checkUser } from "./auth/_actions/isAuthenticated";
import BottomNavbar from "./(mobile)/_components/BottomNavbar";
import LoadingProvider from "@/context/LoadingContext";
import { getCart } from "./cart/_actions/checkCart";

export default async function SiteFacingLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = (await checkUser()) as {
    id: string;
    phone: string;
    username: string;
    role: string;
    profile: { id: string };
  };
  const cart = await getCart();

  return (
    <main dir="rtl">
      <MainNavbar user={user} cart={cart} />
      <LoadingProvider>{children}</LoadingProvider>
      <legend className="sm:hidden">
        <BottomNavbar />
      </legend>
    </main>
  );
}
