"use server";
import db from "@/db/db";
import { fetchAndUploadImage } from "./uploadImages";

type Data = {
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

export async function generateData(fileData: any[]) {
  const data: Data[] = fileData;

  try {
    for (const item of data) {
      if (item.name && item.name !== "" && !(await findProduct(item.name))) {
        await generateProduct({ ...item });
      }
    }
  } catch (e) {
    console.log(e);
  }
}

async function generateSection(name: string, image: string, type: string) {
  if (!image || !name || !type) return null;
  const { path, filename } = await fetchAndUploadImage(`${image}.jpg`);
  if (!path || !filename) return null;

  return await db.section.create({
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

async function findSection(name: string, type: string) {
  return await db.section.findFirst({
    where: {
      AND: [{ name }, { type }],
    },
  });
}

async function findProduct(name: string) {
  return await db.product.findFirst({
    where: {
      AND: [{ name }],
    },
  });
}

async function generateProduct(product: Data) {
  try {
    const category =
      (product.category &&
        product.category !== "" &&
        (await findSection(product.category, "categories"))) ||
      (product.category &&
        product.categoryImage &&
        (await generateSection(
          product.category,
          product.categoryImage,
          "categories",
        )));
    const brand =
      (product.brand &&
        product.brand !== "" &&
        (await findSection(product.brand, "brands"))) ||
      (product.brand &&
        product.brandImage &&
        (await generateSection(product.brand, product.brandImage, "brands")));

    const { path, filename } = await fetchAndUploadImage(
      `${product.productImage}.jpg`,
    );

    const newImage = await db.image.create({
      data: {
        imageType: "ProductImage",
        filename,
        path,
      },
    });

    await db.product.create({
      data: {
        imageId: newImage.id,
        name: product.name,
        body: product.body,
        brandId: brand && brand?.id,
        categoryId: category && category?.id,
        productType:
          !product.productType && product.productType === ""
            ? "normal"
            : product.productType,
        price:
          product.price && product.price === ""
            ? 1.0
            : parseFloat(parseFloat(product.price || "1").toFixed(2)),
        isOffer: product.offerStartsAt != null && product.offerEndsAt != null,
        newPrice:
          !product.newPrice && product.newPrice === ""
            ? undefined
            : parseFloat(parseFloat(product.newPrice || "0").toFixed(2)),
        quantity:
          product.quantity && product.quantity === ""
            ? 100
            : parseInt(product.quantity || "100"),
        offerStartsAt: product.offerStartsAt,
        offerEndsAt: product.offerEndsAt,
        description: product.description,
        weights:
          product.productType === "weight" && product.options
            ? product.options.split("/").map((w) => parseFloat(w))
            : undefined,
        flavors:
          product.productType === "flavor" && product.options
            ? product.options.split("/")
            : undefined,
      },
    });
  } catch (e: any) {
    e.message;
  }
}
