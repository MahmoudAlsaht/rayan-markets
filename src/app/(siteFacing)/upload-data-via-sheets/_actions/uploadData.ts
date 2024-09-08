"use server";
import db from "@/db/db";
import { fetchAndUploadImage } from "./uploadImages";
import { revalidatePath } from "next/cache";

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

function randomize(arr) {
  return Math.floor(Math.random() * (arr.length - 1));
}

const prices = [0.25, 0.3, 0.35, 0.4, 0.45, 0.5, 0.55, 0.6, 0.65, 0.7, 0.75];

export async function generateData(fileData: any[]) {
  const data: Data[] = fileData;

  try {
    // for (let i = 0; i < 1000; i++) {
    //   await generateProduct({
    //     ...data[randomize(data)],
    //     productImage: cloudImages[randomize(cloudImages)],
    //     brandImage: cloudImages[randomize(cloudImages)],
    //     categoryImage: cloudImages[randomize(cloudImages)],
    //   });
    // }
    for (const item of data) {
      if (
        item.name &&
        item.name !== "" &&
        item.body &&
        item.body !== "" &&
        !(await findProduct(item.name, item.body, item.category, item.brand))
      ) {
        await generateProduct({ ...item });
      }
    }
    revalidatePath("/", "layout");
  } catch (e) {
    console.log(e);
  }
}

async function generateSection(name?: string, image?: string, type?: string) {
  if (!name || !image || !type) return null;

  const res = await fetchAndUploadImage(image);
  if (!res) return null;
  const { filename, path } = res;
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

async function findSection(name?: string, type?: string) {
  return await db.section.findFirst({
    where: {
      AND: [{ name }, { type }],
    },
  });
}

async function findProduct(
  name: string,
  body: string,
  categoryName?: string,
  brandName?: string,
) {
  const product = await db.product.findFirst({
    where: {
      name,
    },
  });
  if (!product) return null;
  const category = await findSection(categoryName, "categories");
  const brand = await findSection(brandName, "brands");
  const isDuplicateNameAndBody = product.name === name && product.body === body;
  if (!category && !brand && isDuplicateNameAndBody) return null;
  const isCategoryDuplicate = category
    ? category.id === product.categoryId
    : product.categoryId != null;
  const isBrandDuplicate = brand
    ? brand.id === product.brandId
    : product.brandId != null;
  return isDuplicateNameAndBody && isCategoryDuplicate && isBrandDuplicate
    ? product
    : null;
}

async function generateProduct(product: Data) {
  try {
    const category =
      (await findSection(product.category, "categories")) ||
      (await generateSection(
        product.category,
        product.categoryImage,
        "categories",
      ));
    const brand =
      (product.brand !== "" && (await findSection(product.brand, "brands"))) ||
      (await generateSection(product.brand, product.brandImage, "brands"));

    const res = await fetchAndUploadImage(product.productImage);

    if (!res) return null;
    const { filename, path } = res;

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
        brandId: brand ? brand?.id : null,
        categoryId: category ? category?.id : null,
        productType:
          !product.productType || product.productType === ""
            ? "normal"
            : product.productType,
        price:
          !product.price || product.price === ""
            ? product.newPrice && product.newPrice !== ""
              ? formatPrice(
                  parseFloat(product.newPrice) + randomize(prices).toString(),
                )
              : formatPrice("1.0")
            : formatPrice(product.price),
        isOffer: checkIsOffer(product.offerStartsAt, product.offerEndsAt),
        newPrice: checkIsOffer(product.offerStartsAt, product.offerEndsAt)
          ? !product.newPrice || product.newPrice === ""
            ? product.price && product.price !== ""
              ? formatPrice(product.price)
              : null
            : formatPrice(product.newPrice)
          : null,
        quantity:
          !product.quantity || product.quantity === ""
            ? 0
            : parseInt(product.quantity),
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

function checkIsOffer(startDate, endDate) {
  return startDate != null && endDate != null;
}

function formatPrice(price: string) {
  return parseFloat(parseFloat(price).toFixed(2));
}

// function wait(ms: number): Promise<void> {
//   return new Promise((resolve) => setTimeout(resolve, ms));
// }
