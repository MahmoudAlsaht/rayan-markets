"use server";

import db from "@/db/db";
import { addHours } from "date-fns";
import { ProductCardProps } from "../products/[productType]/[id]/page";
import { Prisma } from "@prisma/client";

function escapeRegExp(str: string) {
  return str?.replace(/[.@&*+?^${}()|[\]\\]/g, ""); // $& means the whole matched string
}

const selectProduct = {
  id: true,
  name: true,
  labels: true,
  description: true,
  body: true,
  price: true,
  newPrice: true,
  productType: true,
  weights: true,
  flavors: true,
  isOffer: true,
  quantity: true,
  image: {
    select: {
      path: true,
    },
  },
};

const orderProductBy = (
  orderBy,
  productType,
  filterSortPrice,
):
  | Prisma.ProductOrderByWithRelationInput
  | Prisma.ProductOrderByWithRelationInput[]
  | undefined =>
  orderBy === "views"
    ? {
        views: "desc",
        newPrice: productType === "offers" ? filterSortPrice : undefined,
        price: productType !== "offers" ? filterSortPrice : undefined,
      }
    : orderBy === "purchases"
      ? {
          numberOfPurchases: "desc",
          newPrice: productType === "offers" ? filterSortPrice : undefined,
          price: productType !== "offers" ? filterSortPrice : undefined,
        }
      : {
          newPrice: productType === "offers" ? filterSortPrice : undefined,
          price: productType !== "offers" ? filterSortPrice : undefined,
        };

export async function handleSearchInput(
  _prevState: unknown,
  formData: FormData,
): Promise<{ products: ProductCardProps[]; nextCursor: number | null }> {
  const query = escapeRegExp(formData.get("query") as string);

  if (query === "" || query == null) return await getMostProducts();

  const data = await searchProducts({ inputQuery: query });

  return data;
}

export async function searchProducts({
  inputQuery,
  cursor,
  limit,
  productType,
  orderBy,
  sortPrice,
}: {
  inputQuery?: string;
  cursor?: number;
  limit?: number;
  productType?: string;
  orderBy?: string;
  sortPrice?: string;
}) {
  const query = escapeRegExp(inputQuery || "");

  const filterSortPrice = sortPrice
    ? sortPrice === "lowest"
      ? "asc"
      : "desc"
    : undefined;

  await checkProductsOffer();

  if (query === "all" || query === "")
    return await getAllProducts(
      orderBy,
      productType,
      cursor,
      limit,
      filterSortPrice,
    );

  const products = await getMatchedProducts(
    query,
    cursor,
    limit,
    filterSortPrice,
    productType,
    orderBy,
  );

  if (products?.products?.length > 0) return products;

  const brandProducts = await getSectionProducts(
    query,
    orderBy,
    productType,
    cursor,
    limit,
    "brands",
    filterSortPrice,
  );

  if (brandProducts && brandProducts.products?.length > 0) return brandProducts;

  const categoryProducts = await getSectionProducts(
    query,
    orderBy,
    productType,
    cursor,
    limit,
    "categories",
    filterSortPrice,
  );

  if (categoryProducts && categoryProducts.products?.length > 0)
    return categoryProducts;

  const labels = await db.label.findMany({
    where: {
      value: {
        contains: query,
        mode: "insensitive",
      },
    },
    select: {
      products: {
        where:
          productType === "for-home"
            ? { productType: "forHome" }
            : productType === "offers"
              ? { isOffer: true }
              : {},
        orderBy: orderProductBy(orderBy, productType, filterSortPrice),
        select: selectProduct,
        take: limit ? limit : undefined,
        skip: cursor ? 1 : 0,
      },
    },
  });

  let labelsProducts: ProductCardProps[] = [];

  for (const label of labels) {
    labelsProducts = [...labelsProducts, ...label.products];
  }

  if (labels && labelsProducts?.length > 0) {
    const products = [
      ...new Map(
        labelsProducts.map((product) => [product["id"], product]),
      ).values(),
    ] as ProductCardProps[];

    const nextCursor = products?.length === limit ? products?.length - 1 : null;

    return {
      products: products,
      nextCursor,
    };
  }

  return await getAllProducts(
    orderBy,
    productType,
    cursor,
    limit,
    filterSortPrice,
  );
}

export async function updateProductViews(id: string) {
  const product = await db.product.findUnique({
    where: { id },
    select: { views: true },
  });
  await db.product.update({
    where: { id },
    data: { views: (product?.views as number) + 1 },
  });
}

export async function sortBasedOnPrice(
  products: ProductCardProps[],
  orderBy: string,
) {
  return orderBy === "highest"
    ? products?.toSorted(
        (a, b) =>
          ((b?.newPrice as number) || (b?.price as number)) -
          ((a.newPrice as number) || (a?.price as number)),
      )
    : orderBy === "lowest"
      ? products?.toSorted(
          (a, b) =>
            ((a?.newPrice as number) || (a?.price as number)) -
            ((b.newPrice as number) || (b?.price as number)),
        )
      : products;
}

async function checkProductsOffer() {
  await db.product.updateMany({
    where: {
      offerEndsAt: {
        lt: addHours(new Date(), 3),
      },
    },
    data: {
      newPrice: null,
      isOffer: false,
      offerStartsAt: null,
      offerEndsAt: null,
    },
  });

  await db.product.updateMany({
    where: {
      offerStartsAt: {
        gt: addHours(new Date(), 3),
      },
    },
    data: {
      isOffer: false,
    },
  });

  await db.product.updateMany({
    where: {
      AND: [
        {
          offerStartsAt: {
            lte: addHours(new Date(), 3),
          },
        },
        {
          offerEndsAt: {
            gt: addHours(new Date(), 3),
          },
        },
      ],
    },
    data: {
      isOffer: true,
    },
  });
}

async function getMostProducts() {
  const mostViewedProducts = await db.product.findMany({
    orderBy: { views: "desc" },
    select: selectProduct,
  });
  const mostPurchasedProducts = await db.product.findMany({
    orderBy: { numberOfPurchases: "desc" },
    select: selectProduct,
  });
  const mostResentProducts = await db.product.findMany({
    orderBy: {},
    select: selectProduct,
  });

  return {
    products: [
      ...new Map(
        [
          ...mostPurchasedProducts,
          ...mostViewedProducts,
          ...mostResentProducts,
        ].map((product) => [product["id"], product]),
      ).values(),
    ] as ProductCardProps[],
    nextCursor: null,
  };
}

async function getAllProducts(
  orderBy,
  productType,
  cursor,
  limit,
  filterSortPrice,
) {
  const products = await db.product.findMany({
    where:
      productType === "for-home"
        ? { productType: "forHome" }
        : productType === "offers"
          ? { isOffer: true }
          : {},
    orderBy: orderProductBy(orderBy, productType, filterSortPrice),
    select: selectProduct,
    take: limit,
    skip: cursor ? 1 : 0,
  });

  const nextCursor = products?.length === limit ? products?.length - 1 : null;
  return { products: products, nextCursor };
}

async function getMatchedProducts(
  query,
  cursor,
  limit,
  filterSortPrice,
  productType,
  orderBy,
) {
  const products = (await db.product.findMany({
    where: {
      AND: [
        productType === "for-home"
          ? { productType: "forHome" }
          : productType === "offers"
            ? { isOffer: true }
            : {},
        {
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { body: { contains: query, mode: "insensitive" } },
          ],
        },
      ],
    },
    select: selectProduct,
    take: limit,
    skip: cursor ? 1 : 0,
    orderBy: orderProductBy(orderBy, productType, filterSortPrice),
  })) as ProductCardProps[];

  const nextCursor = products?.length === limit ? products?.length - 1 : null;

  return { products: products, nextCursor };
}

async function getSectionProducts(
  query: string,
  orderBy,
  productType,
  cursor,
  limit,
  sectionType: string,
  filterSortPrice,
) {
  const sectionProducts =
    sectionType === "categories"
      ? ((
          await db.section.findFirst({
            where: {
              AND: [
                {
                  name: {
                    contains: query as string,
                    mode: "insensitive",
                  },
                  type: {
                    equals: sectionType,
                  },
                },
              ],
            },
            select: {
              categoryProducts: {
                where:
                  productType === "for-home"
                    ? { productType: "forHome" }
                    : productType === "offers"
                      ? { isOffer: true }
                      : {},
                orderBy: orderProductBy(orderBy, productType, filterSortPrice),
                select: selectProduct,
                take: limit,
                skip: cursor ? 1 : 0,
              },
            },
          })
        )?.categoryProducts as ProductCardProps[])
      : ((
          await db.section.findFirst({
            where: {
              AND: [
                {
                  name: {
                    contains: query as string,
                    mode: "insensitive",
                  },
                  type: {
                    equals: sectionType,
                  },
                },
              ],
            },
            select: {
              brandProducts: {
                where:
                  productType === "for-home"
                    ? { productType: "forHome" }
                    : productType === "offers"
                      ? { isOffer: true }
                      : {},
                orderBy: orderProductBy(orderBy, productType, filterSortPrice),
                select: selectProduct,
                take: limit,
                skip: cursor ? 1 : 0,
              },
            },
          })
        )?.brandProducts as ProductCardProps[]);

  const nextCursor =
    sectionProducts?.length === limit ? sectionProducts?.length - 1 : null;

  return {
    products: sectionProducts,
    nextCursor,
  };
}

export async function getProductsForSection(
  cursor?: number,
  limit?: number,
  sectionType?: string,
  sectionId?: string,
  productType?: string,
  orderBy?: string,
) {
  const products = await db.product.findMany({
    where:
      sectionType === "brands"
        ? { brandId: sectionId }
        : sectionType === "categories"
          ? { categoryId: sectionId }
          : productType
            ? productType === "for-home"
              ? { productType: "forHome" }
              : { isOffer: productType === "offers" }
            : {},
    take: limit,
    skip: cursor ? 1 : 0,
    orderBy: orderProductBy(orderBy, productType, undefined),
    select: selectProduct,
  });

  const nextCursor = products?.length === limit ? products?.length - 1 : null;

  return { products: products as ProductCardProps[], nextCursor };
}
