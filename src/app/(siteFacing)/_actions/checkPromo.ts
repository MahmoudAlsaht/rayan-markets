"use server";

import db from "@/db/db";
import { getCart } from "../cart/_actions/checkCart";
import { cookies } from "next/headers";

export async function checkPromoAndAddToCart(code: string) {
  const promo = await db.promoCode.findFirst({
    where: { code: { equals: code, mode: "insensitive" } },
  });

  if (!promo) return null;

  if (promo.active) {
    const currCart = await getCart();
    const updatedCart = { ...currCart, promo };
    cookies().set("cart", JSON.stringify(updatedCart));
  }

  return promo;
}
