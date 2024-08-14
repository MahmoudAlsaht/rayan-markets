import { ReactNode } from "react";
import MainNavbar from "./_components/MainNavbar";
import { checkUser } from "./auth/_actions/isAuthenticated";
import BottomNavbar from "./(mobile)/_components/BottomNavbar";
import { getCart } from "./cart/_actions/checkCart";

export const dynamic =
  process.env.NODE_ENV === "development" && "force-dynamic";

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
      {children}
      <legend className="sm:hidden">
        <BottomNavbar />
      </legend>
    </main>
  );
}
