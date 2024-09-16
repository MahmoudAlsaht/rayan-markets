"use server";

import db from "@/db/db";
import { revalidatePath } from "next/cache";
import { fetchAndUploadImage } from "./uploadImages";
import { deleteCloudinaryImage } from "@/cloudinary";
import { Image, Section } from "@prisma/client";
import { trimAndNormalizeProductData } from "@/lib/trimAndNormalizeProductData";

export type ProductData = {
  name: string;
  body: string;
  price?: string;
  newPrice?: string;
  quantity?: string;
  category?: string;
  brand?: string;
  productType?: string;
  options?: string;
  offerStartsAt?: string;
  offerEndsAt?: string;
  productImage: string;
  brandImage?: string;
  categoryImage?: string;
  description?: string;
};

export async function generateOrUpdateData(
  fileData: ProductData[],
): Promise<void> {
  try {
    for (const item of fileData) {
      const trimmedItem = (await trimAndNormalizeProductData(
        item,
      )) as ProductData;
      if (trimmedItem.name && trimmedItem.body) {
        const existingProduct = await findProduct(
          trimmedItem.name,
          trimmedItem.body,
          trimmedItem.category,
          trimmedItem.brand,
        );
        if (existingProduct) {
          await updateProduct(existingProduct, trimmedItem);
        } else {
          await generateProduct(trimmedItem);
        }
      }
    }
    revalidatePath("/", "layout");
  } catch (error) {
    console.error("Error processing data:", error);
    throw error;
  }
}

async function findProduct(
  name: string,
  body: string,
  categoryName?: string,
  brandName?: string,
) {
  return db.product.findFirst({
    where: {
      name,
      body,
      category: categoryName ? { name: categoryName } : undefined,
      brand: brandName ? { name: brandName } : undefined,
    },
    include: {
      category: true,
      brand: true,
      image: true,
    },
  });
}

async function updateProduct(existingProduct: any, updatedData: ProductData) {
  try {
    let imageId = existingProduct.imageId;
    let categoryId = existingProduct.categoryId;
    let brandId = existingProduct.brandId;

    // Update image if a new one is provided
    if (
      updatedData.productImage &&
      updatedData.productImage !== existingProduct.image.path
    ) {
      const imageRes = await fetchAndUploadImage(updatedData.productImage);
      if (imageRes) {
        const newImage = await db.image.create({
          data: {
            imageType: "ProductImage",
            filename: imageRes.filename,
            path: imageRes.path,
          },
        });

        await deleteCloudinaryImage(existingProduct.image.filename);
        imageId = newImage.id;
      }
    }

    // Update category if changed
    if (
      updatedData.category &&
      updatedData.category !== existingProduct.category?.name
    ) {
      const category = await findOrGenerateSection(
        updatedData.category,
        updatedData.categoryImage,
        "categories",
      );
      categoryId = category?.id ?? null;
    }

    // Update brand if changed
    if (
      updatedData.brand &&
      updatedData.brand !== existingProduct.brand?.name
    ) {
      const brand = await findOrGenerateSection(
        updatedData.brand,
        updatedData.brandImage,
        "brands",
      );
      brandId = brand?.id ?? null;
    }

    // Update the product
    await db.product.update({
      where: { id: existingProduct.id },
      data: {
        imageId,
        categoryId,
        brandId,
        name: updatedData.name,
        body: updatedData.body,
        productType: updatedData.productType || "normal",
        price: calculatePrice(updatedData),
        isOffer: checkIsOffer(
          updatedData.offerStartsAt,
          updatedData.offerEndsAt,
        ),
        newPrice: calculateNewPrice(updatedData),
        quantity: updatedData.quantity ? parseInt(updatedData.quantity) : 0,
        offerStartsAt: updatedData.offerStartsAt,
        offerEndsAt: updatedData.offerEndsAt,
        description: updatedData.description,
        weights: parseProductOptions(updatedData, "weight") as
          | number[]
          | undefined,
        flavors: parseProductOptions(updatedData, "flavor") as
          | string[]
          | undefined,
      },
    });

    console.log(`Updated product: ${updatedData.name}`);
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
}

async function generateProduct(product: ProductData) {
  try {
    const category = await findOrGenerateSection(
      product.category,
      product.categoryImage,
      "categories",
    );
    const brand = product.brand
      ? await findOrGenerateSection(product.brand, product.brandImage, "brands")
      : null;

    const imageRes = await fetchAndUploadImage(product.productImage);
    if (!imageRes) throw new Error("Failed to upload product image");

    const newImage = await db.image.create({
      data: {
        imageType: "ProductImage",
        filename: imageRes.filename,
        path: imageRes.path,
      },
    });

    await db.product.create({
      data: {
        imageId: newImage.id,
        name: product.name,
        body: product.body,
        brandId: brand?.id ?? null,
        categoryId: category?.id ?? null,
        productType: product.productType || "normal",
        price: calculatePrice(product),
        isOffer: checkIsOffer(product.offerStartsAt, product.offerEndsAt),
        newPrice: calculateNewPrice(product),
        quantity: product.quantity ? parseInt(product.quantity) : 0,
        offerStartsAt: product.offerStartsAt,
        offerEndsAt: product.offerEndsAt,
        description: product.description,
        weights: parseProductOptions(product, "weight") as number[] | undefined,
        flavors: parseProductOptions(product, "flavor") as string[] | undefined,
      },
    });

    console.log(`Generated new product: ${product.name}`);
  } catch (error) {
    console.error("Error generating product:", error);
    throw error;
  }
}

async function findOrGenerateSection(
  name?: string,
  image?: string,
  type?: string,
) {
  if (!name) return null;
  const trimmedName = name.trim().replace(/\s+/g, " ");
  let section = await findSection(trimmedName, type);
  if (!section && image) {
    section = (await generateSection(trimmedName, image, type)) as Section & {
      cover: Image;
    };
  } else if (section && image && image !== section.cover?.path) {
    // Update the section image if a new one is provided
    section = await updateSectionImage(
      section as Section & { cover: Image },
      image,
    );
  }
  return section;
}

async function findSection(name?: string, type?: string) {
  if (!name) return null;
  return db.section.findFirst({
    where: { AND: [{ name }, { type }] },
    select: { id: true, name: true, cover: true },
  });
}

async function generateSection(name?: string, image?: string, type?: string) {
  if (!name || !image || !type) return null;

  const res = await fetchAndUploadImage(image);
  if (!res) return null;

  const { filename, path } = res;
  return db.section.create({
    data: {
      name,
      type,
      cover: {
        create: {
          imageType: "SectionCover",
          filename,
          path,
        },
      },
    },
  });
}

async function updateSectionImage(
  section: Section & { cover: Image },
  newImage: string,
) {
  const imageRes = await fetchAndUploadImage(newImage);
  if (!imageRes) return section;

  // Delete the old image
  await deleteCloudinaryImage(section.cover?.filename);

  // Update the section with the new image
  return db.section.update({
    where: { id: section.id },
    data: {
      cover: {
        update: {
          filename: imageRes.filename,
          path: imageRes.path,
        },
      },
    },
    include: {
      cover: true,
    },
  });
}

function checkIsOffer(startDate?: string, endDate?: string): boolean {
  return !!(startDate && endDate);
}

function calculatePrice(product: ProductData): number {
  if (product.price) return formatPrice(product.price);
  if (product.newPrice)
    return formatPrice(parseFloat(product.newPrice) + getRandomPrice());
  return formatPrice("1.0");
}

function calculateNewPrice(product: ProductData): number | null {
  if (!checkIsOffer(product.offerStartsAt, product.offerEndsAt)) return null;
  if (product.newPrice) return formatPrice(product.newPrice);
  if (product.price) return formatPrice(product.price);
  return null;
}

function formatPrice(price: string | number): number {
  return parseFloat(parseFloat(price.toString()).toFixed(2));
}

function parseProductOptions(
  product: ProductData,
  type: "weight" | "flavor",
): number[] | string[] | undefined {
  if (product.productType !== type || !product.options) return undefined;
  const options = product.options.split("/");
  return type === "weight" ? options.map(parseFloat) : options;
}

const PRICES = [0.25, 0.3, 0.35, 0.4, 0.45, 0.5, 0.55, 0.6, 0.65, 0.7, 0.75];

function getRandomPrice(): number {
  return PRICES[Math.floor(Math.random() * PRICES.length)];
}
