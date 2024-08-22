"use server";
import db from "@/db/db";
import { notFound, redirect } from "next/navigation";
import { z } from "zod";
import { getCart, updateCart } from "../../cart/_actions/checkCart";

const phoneNumberRegex = /^(07[789]\d{7})$/;

const addAnonymousSchema = z.object({
  name: z.string().min(1, "الرجاء قم بادخال اسمك"),
  contactNumber: z
    .string()
    .regex(phoneNumberRegex, "رقم الهاتف المدخل غير صحيح!")
    .optional(),
  district: z.string().min(1, "يجب تحديد المنطقة"),
});

export const createAnonymous = async (_: unknown, formData: FormData) => {
  const result = await addAnonymousSchema.safeParse(
    Object.fromEntries(formData.entries()),
  );

  if (result.success === false) return result.error.formErrors.fieldErrors;

  const data = result.data;

  const cart = await getCart();
  if (!cart) return notFound();

  const anonymous = await db.anonymous.create({
    data: {
      name: data.name,
      contact: {
        create: {
          districtId: data.district,
          contactNumber: data.contactNumber,
        },
      },
    },
  });

  const updatedCart = { ...cart, anonymous: anonymous };

  await updateCart(updatedCart);

  redirect("/checkout/payment-method");
};
