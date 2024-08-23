import db from "@/db/db";
import { checkUser } from "../../auth/_actions/isAuthenticated";
import { getOrders } from "../_actions/createNewOrder";
import { OrderCard } from "../_components/OrderCard";

export const selectOrder = {
  id: true,
  orderId: true,
  billTotal: true,
  status: true,
  paymentMethod: true,
  orderTotal: true,
  createdAt: true,
  promoCode: { select: { discount: true, promoType: true } },
  profile: true,
  anonymous: true,
  products: true,
  contact: {
    select: {
      contactNumber: true,
      district: { select: { name: true, shippingFees: true } },
    },
  },
};

export default async function OrdersPage({
  params: { status },
}: {
  params: { status: string };
}) {
  const user = await checkUser();
  const orders = user
    ? user.role === "customer"
      ? await db.order.findMany({
          where: {
            AND: [
              { profileId: user.profile?.id },
              status !== "all" ? { status } : {},
            ],
          },
          orderBy: { createdAt: "desc" },
          select: selectOrder,
        })
      : await db.order.findMany()
    : (await getOrders())?.toSorted(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );

  return (
    <>
      <div
        className="container mt-4 grid grid-cols-1 gap-4 sm:mt-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5"
        dir="rtl"
      >
        {orders?.map((order) => <OrderCard key={order.id} order={order} />)}
      </div>
    </>
  );
}
