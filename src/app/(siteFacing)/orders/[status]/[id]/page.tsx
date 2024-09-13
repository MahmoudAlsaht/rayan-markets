import db from "@/db/db";
import { OrderCard } from "../../_components/OrderCard";
import { notFound } from "next/navigation";
import { checkUser } from "@/app/(siteFacing)/auth/_actions/isAuthenticated";
import { OrderCardProp, select } from "../../_actions/searchOrders";
import OrdersTabs from "../../_components/OrdersTabs";

export default async function OrderDetails({
  params: { id },
}: {
  params: { id: string };
}) {
  const order = await db.order.findUnique({
    where: { id },
    select,
  });

  const user = await checkUser();

  if (order == null) return notFound();

  return (
    <OrdersTabs userRole={user ? user.role : "anonymous"}>
      <main className="mx-auto mt-10 w-11/12 rounded-xl bg-slate-50 px-6 py-2">
        <OrderCard
          user={user}
          order={order as OrderCardProp}
          isOrderDetailsPage
        />
      </main>
    </OrdersTabs>
  );
}
