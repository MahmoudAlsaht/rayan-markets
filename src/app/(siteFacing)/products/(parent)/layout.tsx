import BackButtonNav from "@/components/BackButtonNav";
import React, { ReactNode } from "react";

export default function ProductsLayout({ children }: { children: ReactNode }) {
  return (
    <main>
      <div className="sm:hidden">
        <BackButtonNav goHome />
      </div>
      {children}
    </main>
  );
}
