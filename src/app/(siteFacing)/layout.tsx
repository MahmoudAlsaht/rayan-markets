import { ReactNode } from "react";
import MainNavbar from "./_components/MainNavbar";
import { checkUser } from "./auth/_actions/isAuthenticated";
import BottomNavbar from "./(mobile)/_components/BottomNavbar";
import LoadingProvider from "@/context/LoadingContext";
import CartProvider from "@/context/cart/CartContext";

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
  return (
    <main dir="rtl">
      <CartProvider>
        <MainNavbar user={user} />
        <LoadingProvider>{children}</LoadingProvider>
        <legend className="sm:hidden">
          <BottomNavbar />
        </legend>
      </CartProvider>
    </main>
  );
}
