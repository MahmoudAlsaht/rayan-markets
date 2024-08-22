import db from "@/db/db";
import { checkUser } from "../auth/_actions/isAuthenticated";
import { cookies } from "next/headers";
import { getOrders } from "./_actions/createNewOrder";
import Widget from "@/app/admin/_components/Widget";

export default async function OrdersPage() {
  const user = await checkUser();
  const orders = user
    ? user.role === "customer"
      ? await db.order.findMany({ where: { profileId: user.profile?.id } })
      : await db.order.findMany()
    : await getOrders();
  return (
    <div
      className="mt-4 grid grid-cols-1 gap-4 sm:mt-8 md:grid-cols-2 lg:grid-cols-3"
      dir="rtl"
    >
      {orders?.map((order) => (
        <Widget
          className="h-48"
          key={order.id}
          title={order.orderId}
          href="#"
        />
      ))}
    </div>
  );
}
