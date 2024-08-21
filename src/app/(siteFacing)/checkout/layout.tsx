import { ReactNode } from "react";
import CheckoutNav from "./_components/CheckoutNav";

export default function checkoutLayout({ children }: { children: ReactNode }) {
  return (
    <main
      dir="rtl"
      className="mt-10 flex w-full flex-col items-center justify-center gap-6"
    >
      <CheckoutNav />
      {children}
    </main>
  );
}
