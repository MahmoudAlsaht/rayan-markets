import db from "@/db/db";
import { OrderCard, OrderCardProp } from "../../_components/OrderCard";
import { notFound } from "next/navigation";
import { selectOrder } from "../page";

export default async function OrderDetails({
  params: { id },
}: {
  params: { id: string };
}) {
  const order = await db.order.findUnique({
    where: { id },
    select: selectOrder,
  });

  if (order == null) return notFound();

  return (
    <main className="mx-auto mt-10 w-11/12 rounded-xl bg-slate-50 px-6 py-2 md:w-9/12 lg:w-6/12">
      <OrderCard order={order as OrderCardProp} isOrderDetailsPage />
    </main>
  );
}
