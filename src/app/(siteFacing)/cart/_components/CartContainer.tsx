"use client";

import { Cart } from "@/context/cart/CartContext";
import CartCard from "./CartCard";
import BackButtonNav from "@/components/BackButtonNav";
import PageHeader from "@/components/PageHeader";
import { useRouter } from "next/navigation";

export default function CartContainer({ cart }: { cart: Cart }) {
  const router = useRouter();
  return (
    <main dir="rtl">
      <div className="hidden sm:block">
        <BackButtonNav bg={false} />
      </div>

      <PageHeader title="السلة" />

      {/* <section className="grid grid-cols-2 gap-2 pt-5 sm:grid-cols-4">
        {cart?.products.map((product) => (
          <CartCard key={product.id} productId={product.id} />
        ))}
      </section> */}

      <div className="h-20"></div>
    </main>
  );
}
