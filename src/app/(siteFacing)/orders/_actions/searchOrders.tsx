import db from "@/db/db";
import { checkUser } from "../../auth/_actions/isAuthenticated";
import { redirect } from "next/navigation";

export const select = {
  id: true,
  orderId: true,
  billTotal: true,
  status: true,
  paymentMethod: true,
  orderTotal: true,
  createdAt: true,
  pickUpDate: true,
  promoCode: { select: { discount: true, promoType: true, code: true } },
  profile: true,
  anonymous: true,
  products: true,
  note: true,
  contact: {
    select: {
      contactNumber: true,
      district: { select: { name: true, shippingFees: true } },
    },
  },
};

export async function searchOrders(
  status: string | undefined,
  query: string | undefined,
) {
  const user = await checkUser();
  if (!user) redirect("/");

  const orders = await filterOrders(
    user.role !== "customer" ? "authorized" : "customer",
    user.id,
    query,
    status,
  );

  return { user, orders };
}

async function filterOrders(
  userRole: "authorized" | "customer",
  userId: string,
  query: string | undefined,
  status: string | undefined,
) {
  return userRole === "authorized"
    ? await db.order.findMany({
        where: {
          AND: [
            !query ? {} : { orderId: { contains: query } },
            status === "all" || !status ? {} : { status },
          ],
        },
        select,
        orderBy: { createdAt: "desc" },
      })
    : await db.order.findMany({
        where: {
          AND: [
            { profile: { userId } },
            { orderId: query !== "" ? { contains: query } : {} },
          ],
        },
        select,
        orderBy: { createdAt: "desc" },
      });
}
