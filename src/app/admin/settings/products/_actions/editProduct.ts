"use server";
import { deleteCloudinaryImage, upload } from "@/cloudinary";
import db from "@/db/db";
import { addHours, addMinutes } from "date-fns";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { DateRange } from "react-day-picker";
import z from "zod";

const productImageSchema = z
  .instanceof(File, { message: "الرجاء اختر صورة للمنتج" })
  .refine((file) => file.size === 0 || file.type.startsWith("image/"));
const editProductSchema = z.object({
  category: z.string().min(1, "الرجاء قم باختيار قسم"),
  brand: z.string().min(1, "الرجاء قم باختيار علامة"),
  name: z.string().min(1, "الرجاء ادخال هذا الحقل"),
  body: z.string().min(1, "الرجاء ادخال هذا الحقل"),
  price: z
    .string()
    .min(0.05, "الرجاء ادخال هذا الحقل")
    .regex(/^(?!0\d|[0.]*$)\d*\.?\d+$/),
  quantity: z
    .string()
    .min(1, "الرجاء ادخال هذا الحقل")
    .regex(/^[0-9]\d*$/),
  productType: z.string().min(1, "الرجاء اختيار نوع المنتج"),
  description: z.string().min(1, "الرجاء ادخال هذا الحقل").optional(),
  options: z.string().min(1, "الرجاء ادخال هذا الحقل").optional(),
  isOffer: z.string().optional(),
  newPrice: z
    .string()
    .min(0.05, "الرجاء ادخال هذا الحقل")
    .regex(/^(?!0\d|[0.]*$)\d*\.?\d+$/)
    .optional(),
  productImage: productImageSchema.optional(),
});

export async function editProduct(
  date: DateRange | undefined,
  id: string,
  _prevState: unknown,
  formData: FormData,
) {
  const result = editProductSchema.safeParse(
    Object.fromEntries(formData.entries()),
  );

  if (result.success === false) return result.error.formErrors.fieldErrors;

  const data = result.data;

  const currentProduct = await db.product.findUnique({
    where: { id },
  });

  if (data.productImage && data.productImage.size > 0) {
    const currentProductImage = await db.image.findUnique({
      where: { id: currentProduct?.imageId as string },
    });
    if (currentProductImage && currentProductImage.filename)
      deleteCloudinaryImage(currentProductImage.filename);
    const productImage = await upload(data.productImage);
    await db.image.update({
      where: { id: currentProductImage?.id as string },
      data: {
        filename: productImage?.filename,
        path: productImage?.path,
      },
    });
  }

  const options = data.options?.split(" ");

  await db.product.update({
    where: { id },
    data: {
      name: data.name || currentProduct?.name,
      categoryId: data.category || currentProduct?.categoryId,
      brandId: data.brand || currentProduct?.brandId,
      body: data.body || currentProduct?.body,
      price: parseFloat(data.price) || currentProduct?.price,
      quantity: parseInt(data.quantity) || currentProduct?.quantity,
      productType: data.productType
        ? data.productType
        : currentProduct?.productType,
      weights:
        data.productType === "weight"
          ? options?.map((w) => parseFloat(w)) || currentProduct?.weights
          : [],
      flavors:
        data.productType === "flavor" ? options || currentProduct?.flavors : [],
      isOffer: data.isOffer === "on" ? true : false,
      description:
        data.productType === "forHome"
          ? data.description
            ? data.description
            : currentProduct?.description
          : null,
      newPrice:
        data.isOffer === "on"
          ? parseFloat(data.newPrice as string) || currentProduct?.newPrice
          : null,
      offerStartsAt:
        data.isOffer === "on"
          ? (date?.from && addHours(date?.from, 3)) ||
            currentProduct?.offerStartsAt
          : null,
      offerEndsAt:
        data.isOffer === "on"
          ? (date?.to && addMinutes(date.to, 1619)) ||
            currentProduct?.offerEndsAt
          : null,
    },
  });

  revalidatePath("/", "layout");

  redirect("/admin/settings/products");
}
