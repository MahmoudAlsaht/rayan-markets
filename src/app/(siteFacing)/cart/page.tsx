import BackButtonNav from "@/components/BackButtonNav";
import PageHeader from "@/components/PageHeader";
import { getCart } from "./_actions/checkCart";
import CartContainer, {
  CartContainerSkeleton,
} from "./_components/CartContainer";
import { Suspense } from "react";

export default function CartPage() {
  return (
    <main className="sm:mt-10">
      <div className="sm:hidden">
        <BackButtonNav bg={false} />
      </div>
      <PageHeader title="السلة" mt="10" />

      <Suspense fallback={<CartContainerSkeleton />}>
        <CartSuspense />
      </Suspense>
      <div className="h-20" />
    </main>
  );
}

async function CartSuspense() {
  const cart = await getCart();
  return <CartContainer cart={cart} />;
}
