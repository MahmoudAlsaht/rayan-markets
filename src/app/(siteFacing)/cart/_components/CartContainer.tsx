import CartCard, { CartCardSkeleton } from "./CartCard";
import { Cart } from "@/app/(siteFacing)/cart/_actions/checkCart";
import { Button } from "@/components/ui/button";
import { LoadingLink } from "@/context/LoadingContext";
import { formatCurrency } from "@/lib/formatters";
import { redirect } from "next/navigation";
import CheckPromoForm from "./CheckPromoForm";

const CART_MIN = 5;

type CartContainerProps = {
  cart: Cart | null;
  user: {
    id: string;
    phone: string;
    username: string;
    role: string;
    profile: {
      id: string;
    } | null;
  } | null;
};
export default function CartContainer({ cart, user }: CartContainerProps) {
  if (!cart) redirect("/");
  return (
    <main dir="rtl" className="flex w-full flex-col gap-4">
      <section className="grid grid-cols-1 gap-2 pt-5 sm:container sm:order-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {cart?.products.map((product) => (
          <CartCard key={product.id} product={product} />
        ))}
      </section>

      <div className="container flex flex-col items-center gap-2">
        <CheckPromoForm cart={cart} />
        <Button
          disabled={cart.total < CART_MIN}
          className="w-full rounded-xl sm:w-1/3"
        >
          <LoadingLink href="/checkout/contact">تأكيد الاختيار</LoadingLink>
        </Button>
        {cart.total < CART_MIN ? (
          <div className="text-center text-lg text-destructive sm:order-1 sm:text-xl">
            <p>المبلغ الإجمالي: ({formatCurrency(cart.total)}) </p>
            {`يجب أن لا يقل المبلغ الإجمالي للسلة عن (${formatCurrency(CART_MIN)}) حتى تستطيع إكمال
            عملية الشراء`}
          </div>
        ) : (
          <p className="text-xl sm:order-1 sm:text-2xl">
            المبلغ الإجمالي: {formatCurrency(cart.total)}
          </p>
        )}
      </div>

      <div className="order-10 h-20"></div>
    </main>
  );
}

export function CartContainerSkeleton() {
  return (
    <section className="">
      <main dir="rtl" className="flex flex-col gap-4">
        <section className="order-2 grid grid-cols-2 gap-2 pt-5 sm:order-1 sm:grid-cols-4">
          <CartCardSkeleton />
          <CartCardSkeleton />
          <CartCardSkeleton />
          <CartCardSkeleton />
          <CartCardSkeleton />
          <CartCardSkeleton />
          <CartCardSkeleton />
          <CartCardSkeleton />
        </section>
        <div className="container flex flex-col items-center gap-2 sm:order-2">
          <Button disabled className="w-full rounded-xl sm:w-1/5"></Button>
        </div>
        <div className="order-10 h-20"></div>
      </main>
    </section>
  );
}
