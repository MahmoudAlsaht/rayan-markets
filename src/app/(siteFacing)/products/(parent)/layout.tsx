import BackButtonNav from "@/components/BackButtonNav";
import LoadingProvider from "@/context/LoadingContext";
import React, { ReactNode } from "react";
import MobileProductsContainer from "../../(mobile)/_components/MobileProductsNav";

export default function ProductsLayout({ children }: { children: ReactNode }) {
  return (
    <main>
      <div className="sm:hidden">
        <BackButtonNav goHome />
        <MobileProductsContainer />
      </div>

      <LoadingProvider>{children}</LoadingProvider>
    </main>
  );
}
