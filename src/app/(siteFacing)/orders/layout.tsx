import { ReactNode } from "react";
import OrdersTabs from "./_components/OrdersTabs";
import BackButtonNav from "@/components/BackButtonNav";

export default function ordersLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <BackButtonNav />
      <OrdersTabs />
      {children}
    </>
  );
}
