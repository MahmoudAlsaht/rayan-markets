"use server";
import { upload } from "@/cloudinary";
import db from "@/db/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import z from "zod";

const bannerImageSchema = z
  .instanceof(File, { message: "الرجاء اختر صورة للقسم" })
  .refine((file) => file.size === 0 || file.type.startsWith("image/"));

const addBannerSchema = z.object({
  bannerType: z.string().min(1, "الرجاء ادخال هذا الحقل"),
  bannerImages: bannerImageSchema.refine(
    (file) => file.size > 0,
    "الرجاء اختر صورة للعلامة",
  ),
  mobileImages: bannerImageSchema.optional(),
});

export async function createNewBanner(_prevState: unknown, formData: FormData) {
  const result = addBannerSchema.safeParse(
    Object.fromEntries(formData.entries()),
  );

  if (result.success === false) return result.error.formErrors.fieldErrors;

  const data = result.data;

  const checkBannerExists = await db.banner.findUnique({
    where: { bannerType: data.bannerType },
  });

  const bannerImages = formData.getAll("bannerImages") as File[];
  const mobileImages = formData.getAll("mobileImages") as File[];

  const imagesIds = await uploadBannerImages(bannerImages);
  const mobileImagesIds = await uploadBannerImages(mobileImages);

  if (checkBannerExists == null) {
    await db.banner.create({
      data: {
        bannerType: data.bannerType,
        images: {
          connect: imagesIds,
        },
        mobileImages: {
          connect: mobileImagesIds,
        },
      },
    });

    revalidatePath("/", "layout");

    return redirect("/admin/settings/banners");
  }

  await db.banner.update({
    where: { id: checkBannerExists.id },
    data: {
      images: {
        connect: imagesIds,
      },
      mobileImages: {
        connect: mobileImagesIds,
      },
    },
  });

  data.bannerType === "main" && revalidatePath("/");
  data.bannerType === "offers" && revalidatePath("/products/offers");
  data.bannerType === "forHome" && revalidatePath("/products/for-home");

  redirect("/admin/settings/banners");
}

async function uploadBannerImages(files: File[]) {
  const uploadedImages: { id: string }[] = [];

  for (const file of files) {
    const image = await upload(file);
    if (image?.filename && image.path) {
      const newImage = await db.image.create({
        data: {
          imageType: "BannerImage",
          filename: image?.filename as string,
          path: image?.path as string,
        },
      });
      uploadedImages.push({
        id: newImage.id,
      });
    }
  }

  return uploadedImages;
}
