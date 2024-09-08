"use server";

import db from "@/db/db";

export async function deleteBarCode(productId: string, barCodeId: string) {
  const product = await db.product.findUnique({
    where: { id: productId },
    select: { barCodeIds: true },
  });

  await db.product.update({
    where: { id: productId },
    data: {
      barCodeIds: product?.barCodeIds.filter((id) => id !== barCodeId),
    },
  });

  await db.barCode.delete({ where: { id: barCodeId } });
}
