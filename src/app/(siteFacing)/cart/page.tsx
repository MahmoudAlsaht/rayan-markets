import BackButtonNav from "@/components/BackButtonNav";
import PageHeader from "@/components/PageHeader";
import CartContainer, {
  CartContainerSkeleton,
} from "./_components/CartContainer";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getCart } from "../_context/cart/actions/checkCart";

export default function CartPage() {
  return (
    <main className="h-screen sm:mt-10">
      <div className="sm:hidden">
        <BackButtonNav />
      </div>
      <PageHeader title="السلة" mt="10" />

      <Suspense fallback={<CartContainerSkeleton />}>
        <CartSuspense />
      </Suspense>
    </main>
  );
}

async function CartSuspense() {
  const cart = await getCart();
  if (!cart) redirect("/");
  return <CartContainer />;
}
