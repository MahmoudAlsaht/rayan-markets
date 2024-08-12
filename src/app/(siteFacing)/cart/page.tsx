import BackButtonNav from "@/components/BackButtonNav";
import PageHeader from "@/components/PageHeader";
import { getCart } from "./_actions/checkCart";
import CartContainer from "./_components/CartContainer";

export default async function CartPage() {
  const cart = await getCart();
  return (
    <main className="sm:mt-10">
      <div className="sm:hidden">
        <BackButtonNav bg={false} />
      </div>
      <PageHeader title="السلة" mt="10" />
      <CartContainer cart={cart} />
      <div className="h-20" />
    </main>
  );
}
