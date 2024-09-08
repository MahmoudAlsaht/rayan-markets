"use server";

import db from "@/db/db";

export async function createNewBarCodes(formData: FormData, productId: string) {
  const selectedBarCodes = formData.getAll("barCodes");

  for (const barCode of selectedBarCodes) {
    const dbBarCode = await db.barCode.findFirst({
      where: { value: barCode as string },
    });
    if (dbBarCode != null) {
      const product = await db.product.findUnique({
        where: { id: productId },
        select: {
          barCode: { where: { id: dbBarCode.id } },
        },
      });
      if (product && product.barCode && product.barCode.length === 0) {
        await db.barCode.update({
          where: { id: dbBarCode.id },
          data: {
            products: {
              connect: [{ id: productId }],
            },
          },
        });
      }
    } else
      await db.product.update({
        where: { id: productId },
        data: {
          barCode: {
            create: {
              value: barCode as string,
            },
          },
        },
      });
  }
}
