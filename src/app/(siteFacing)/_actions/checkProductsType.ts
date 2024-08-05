"use server";

import db from "@/db/db";

export async function checkProductTypeExists(type: string) {
  const products =
    type === "forHome"
      ? await db.product.findFirst({ where: { productType: type } })
      : await db.product.findFirst({ where: { isOffer: true } });

  if (!products) return false;

  return true;
}
