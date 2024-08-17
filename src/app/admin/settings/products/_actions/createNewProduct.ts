"use server";
import { upload } from "@/cloudinary";
import db from "@/db/db";
import { addHours, addMinutes } from "date-fns";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { DateRange } from "react-day-picker";
import z from "zod";

const productImageSchema = z
  .instanceof(File, { message: "الرجاء اختر صورة للمنتج" })
  .refine((file) => file.size === 0 || file.type.startsWith("image/"));
const addProductSchema = z.object({
  category: z.string().min(1, "الرجاء قم باختيار قسم"),
  brand: z.string().min(1, "الرجاء قم باختيار علامة"),
  name: z.string().min(1, "الرجاء ادخال هذا الحقل"),
  body: z.string().min(1, "الرجاء ادخال هذا الحقل"),
  price: z
    .string()
    .min(1, "الرجاء ادخال هذا الحقل")
    .regex(/^[1-9]\d*(\.\d+)?$/),
  quantity: z
    .string()
    .min(1, "الرجاء ادخال هذا الحقل")
    .regex(/^[1-9]\d*$/),
  productType: z.string().min(1, "الرجاء اختيار نوع المنتج"),
  description: z.string().min(1, "الرجاء ادخال هذا الحقل").optional(),
  options: z.string().min(1, "الرجاء ادخال هذا الحقل").optional(),
  isOffer: z.string().optional(),
  newPrice: z
    .string()
    .min(1, "الرجاء ادخال هذا الحقل")
    .regex(/^[1-9]\d*(\.\d+)?$/)
    .optional(),
  productImage: productImageSchema.refine(
    (file) => file.size > 0,
    "الرجاء اختر صورة للمنتج",
  ),
});

export async function createNewProduct(
  date: DateRange | undefined,
  _prevState: unknown,
  formData: FormData,
) {
  const result = addProductSchema.safeParse(
    Object.fromEntries(formData.entries()),
  );

  if (result.success === false) return result.error.formErrors.fieldErrors;

  const data = result.data;

  const checkProductExists = await db.product.findFirst({
    where: { name: data.name },
  });

  if (checkProductExists != null)
    return {
      name: "هذا المنتج موجود بالفعل",
      category: "",
      brand: "",
      body: "",
      price: "",
      newPrice: "",
      quantity: "",
      productType: "",
      productImage: "",
      description: "",
      options: "",
    };

  const options = data.options?.split(" ");

  const productImage = await upload(data.productImage);

  const newImage = await db.image.create({
    data: {
      imageType: "ProductImage",
      filename: productImage?.filename as string,
      path: productImage?.path as string,
    },
  });

  await db.product.create({
    data: {
      name: data.name,
      categoryId: data.category,
      brandId: data.brand,
      body: data.body,
      price: parseFloat(data.price),
      quantity: parseInt(data.quantity),
      productType: data.productType,
      isOffer: data.isOffer === "on" ? true : false,
      imageId: newImage.id,
      weights:
        data.productType === "weight" ? options?.map((w) => parseFloat(w)) : [],
      flavors: data.productType === "flavor" ? options : [],
      description: data.productType === "forHome" ? data.description : null,
      newPrice:
        data.isOffer === "on" ? parseFloat(data.newPrice as string) : null,
      offerStartsAt:
        data.isOffer === "on" ? date?.from && addHours(date?.from, 3) : null,
      offerEndsAt:
        data.isOffer === "on" ? date?.to && addMinutes(date.to, 1619) : null,
    },
  });

  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath("/products/offers");
  revalidatePath("/products/for-home");

  redirect("/admin/settings/products");
}
