import CartCard from "./CartCard";
import { Cart } from "@/app/(siteFacing)/cart/_actions/checkCart";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/formatters";
import Link from "next/link";
import { redirect } from "next/navigation";

const CART_MIN = 5;

export default function CartContainer({ cart }: { cart: Cart | null }) {
  if (!cart) redirect("/");
  return (
    <main dir="rtl" className="flex flex-col gap-4">
      <section className="order-2 grid grid-cols-2 gap-2 pt-5 sm:order-1 sm:grid-cols-4">
        {cart?.products.map((product) => (
          <CartCard key={product.id} product={product} />
        ))}
      </section>
      <div className="container flex flex-col items-center gap-2 sm:order-2">
        {cart.total < CART_MIN ? (
          <div className="order-10 text-center text-lg text-destructive sm:order-1 sm:text-xl">
            <p>المجموع: ({formatCurrency(cart.total)}) </p>
            {`يجب أن لا يقل المجموع الكلي للسلة عن (${formatCurrency(CART_MIN)}) حتى تستطيع إكمال
            عملية الشراء`}
          </div>
        ) : (
          <p className="order-10 text-xl sm:order-1 sm:text-2xl">
            المجموع: {formatCurrency(cart.total)}
          </p>
        )}

        <Button
          disabled={cart.total < CART_MIN}
          className="w-full rounded-xl sm:w-1/5"
        >
          <Link href={"#"}>أكمل للدفع</Link>
        </Button>
      </div>
      <div className="order-10 h-20"></div>
    </main>
  );
}
