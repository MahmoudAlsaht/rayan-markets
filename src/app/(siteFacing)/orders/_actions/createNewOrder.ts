"use server";

import { checkUser } from "@/app/(siteFacing)/auth/_actions/isAuthenticated";
import {
  CartProduct,
  getCart,
} from "@/app/(siteFacing)/cart/_actions/checkCart";
import db from "@/db/db";
import { Anonymous, Order, User } from "@prisma/client";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import z from "zod";
import { deleteCart } from "../../cart/_actions/cartActions";

const addOrderSchema = z.object({
  paymentMethod: z.enum(["card", "cash", "eWallet"], {
    required_error: "اختر طريقة الدفع",
  }),
  note: z.string().optional(),
});

export async function createNewOrder(formData: FormData) {
  const result = await addOrderSchema.safeParse(
    Object.fromEntries(formData.entries()),
  );

  if (result.success === false) return result.error.formErrors.fieldErrors;

  const data = result.data;

  const user = await checkUser();
  const cart = await getCart();

  if (!cart) return notFound();

  const customer = user || cart?.anonymous;

  const contact = await db.contact.findFirst({
    where: {
      AND: [
        {
          OR: [
            {
              profileId: (
                customer as Partial<User & { profile: { id: string } | null }>
              )?.profile?.id,
            },
            { anonymousId: (customer as Partial<Anonymous>).id },
          ],
        },
        { defaultContact: true },
      ],
    },
    select: {
      id: true,
      profileId: true,
      anonymousId: true,
      district: { select: { id: true, shippingFees: true } },
    },
  });

  if (!contact) return notFound();

  const productName = (product: CartProduct) =>
    product.flavor
      ? `${product.name} - (${product.flavor})`
      : product.weight
        ? product?.weight === 0.25
          ? `(ربع كيلو) ${product.name}`
          : product.weight === 0.5
            ? `(نصف كيلو) ${product.name}`
            : product.weight === 0.75
              ? `(كيلو الا ربع) ${product.name}`
              : `(${product.weight} كيلو) ${product.name}`
        : product.name;

  const newOrderProduct = (product: CartProduct) => ({
    productLink: `/products/any/${product.id}`,
    name: productName(product),
    price: product.price,
    total: product.total,
    image: product.image,
    quantity: product.quantity,
    counter: product.counter,
  });

  const { promoCode } = cart;

  const calcShippingDiscount =
    promoCode && promoCode.promoType === "shippingFees"
      ? contact.district.shippingFees -
        contact.district.shippingFees * (promoCode.discount / 100)
      : contact.district.shippingFees;
  const calcOrderBill =
    promoCode && promoCode.promoType === "productPrice"
      ? cart.total - cart.total * (promoCode.discount / 100)
      : cart.total;
  const orderTotal = calcOrderBill + calcShippingDiscount;

  const newOrder = await db.order.create({
    data: {
      products: {
        createMany: {
          data: cart?.products.map((product) => newOrderProduct(product)),
        },
      },
      paymentMethod: data.paymentMethod,
      status: "pending",
      billTotal: parseFloat(cart.total.toFixed(2)),
      promoCodeId: cart.promoCode?.id,
      contactId: contact.id,
      profileId: contact.profileId,
      anonymousId: contact.anonymousId,
      orderTotal: parseFloat(orderTotal.toFixed(2)),
      orderId: genOrderId(),
      note: data.note,
    },
  });

  for (const product of cart.products) {
    await db.product.update({
      where: { id: product.id },
      data: { quantity: product.quantity - product.counter },
    });
  }

  await deleteCart();

  redirect(`/orders/pending/${newOrder?.id}`);
}

function genOrderId() {
  let orderId = "";

  for (let i = 0; i < 10; i++) {
    orderId += `${Math.floor(Math.random() * 10)}`;
  }
  return orderId;
}

export async function getOrders() {
  const checkCookies = cookies().get("orders");

  if (!checkCookies?.value) return null;

  const orders = JSON.parse(checkCookies.value);

  if (orders == null) return null;

  return orders as Order[];
}

export async function addOrder(newOrder: Order) {
  const orders = await getOrders();
  const updatedOrders = !orders ? [newOrder] : [...orders, newOrder];

  cookies().set("orders", JSON.stringify(updatedOrders));
}

export async function updateOrders(updatedOrder: Order) {
  const orders = await getOrders();
  if (!orders) return;
  const updatedOrders = [
    ...orders,
    orders.map((order) =>
      order.id === updatedOrder?.id ? updatedOrder : order,
    ),
  ];

  cookies().set("orders", JSON.stringify(updatedOrders));
}
