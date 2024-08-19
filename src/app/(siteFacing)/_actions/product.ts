"use server";

import db from "@/db/db";
import { addHours } from "date-fns";
import { ProductCardProps } from "../products/_components/ProductCard";

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

export async function handleSearchInput(
  _prevState: unknown,
  formData: FormData,
): Promise<ProductCardProps[] | null> {
  const query = escapeRegExp(formData.get("query") as string);

  if (query === "" || query == null) return await getMostProducts();

  const products = await searchProducts(query);

  return products;
}

export async function searchProducts(
  inputQuery = "all",
  orderBy = "",
  productType = "any",
  productCount: number | undefined = undefined,
) {
  const query = escapeRegExp(inputQuery);

  await checkProductsOffer();

  if (!query || query == "all" || query === "")
    return await getAllProducts(orderBy, productType, productCount);

  const brandProducts = await getSectionProducts(
    query,
    orderBy,
    productType,
    productCount,
    "brands",
  );

  if (brandProducts && brandProducts.length > 0)
    return brandProducts as ProductCardProps[];

  const categoryProducts = await getSectionProducts(
    query,
    orderBy,
    productType,
    productCount,
    "categories",
  );

  if (categoryProducts && categoryProducts.length > 0) return categoryProducts;

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
        orderBy:
          orderBy === "views"
            ? { views: "desc" }
            : orderBy === "purchases"
              ? { numberOfPurchases: "desc" }
              : {},
        select: {
          id: true,
          name: true,
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
        },
        take: productCount,
      },
    },
  });

  let labelsProducts: ProductCardProps[] = [];

  for (const label of labels) {
    labelsProducts = [...labelsProducts, ...label.products];
  }

  if (labels && labelsProducts.length > 0)
    return [
      ...new Map(
        labelsProducts.map((product) => [product["id"], product]),
      ).values(),
    ] as ProductCardProps[];

  const products = await getAllProducts(orderBy, productType, productCount);

  if (products?.length === 0) return products;

  return products;
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
    take: 6,
    select: selectProduct,
  });
  const mostPurchasedProducts = await db.product.findMany({
    orderBy: { numberOfPurchases: "desc" },
    take: 6,
    select: selectProduct,
  });
  const mostResentProducts = await db.product.findMany({
    orderBy: { createdAt: "desc" },
    take: 6,
    select: selectProduct,
  });

  return [
    ...new Map(
      [
        ...mostPurchasedProducts,
        ...mostViewedProducts,
        ...mostResentProducts,
      ].map((product) => [product["id"], product]),
    ).values(),
  ] as ProductCardProps[];
}

async function getAllProducts(orderBy, productType, productCount) {
  return (await db.product.findMany({
    where:
      productType === "for-home"
        ? { productType: "forHome" }
        : productType === "offers"
          ? { isOffer: true }
          : {},
    orderBy:
      orderBy === "views"
        ? { views: "desc" }
        : orderBy === "purchases"
          ? { numberOfPurchases: "desc" }
          : { createdAt: "desc" },
    select: selectProduct,
    take: productCount,
  })) as ProductCardProps[];
}

async function getSectionProducts(
  query: string,
  orderBy,
  productType,
  productCount,
  sectionType: string,
) {
  const section = await db.section.findFirst({
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
      brandProducts:
        sectionType === "brands"
          ? {
              where:
                productType === "for-home"
                  ? { productType: "forHome" }
                  : productType === "offers"
                    ? { isOffer: true }
                    : {},
              orderBy:
                orderBy === "views"
                  ? { views: "desc" }
                  : orderBy === "purchases"
                    ? { numberOfPurchases: "desc" }
                    : {},
              select: {
                id: true,
                name: true,
                price: true,
                productType: true,
                newPrice: true,
                flavors: true,
                weights: true,
                isOffer: true,
                image: {
                  select: {
                    path: true,
                  },
                },
              },
              take: productCount,
            }
          : false,

      categoryProducts:
        sectionType === "categories"
          ? {
              where:
                productType === "for-home"
                  ? { productType: "forHome" }
                  : productType === "offers"
                    ? { isOffer: true }
                    : {},
              orderBy:
                orderBy === "views"
                  ? { views: "desc" }
                  : orderBy === "purchases"
                    ? { numberOfPurchases: "desc" }
                    : {},
              select: {
                id: true,
                name: true,
                price: true,
                productType: true,
                newPrice: true,
                flavors: true,
                weights: true,
                isOffer: true,
                image: {
                  select: {
                    path: true,
                  },
                },
              },
              take: productCount,
            }
          : false,
    },
  });
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
                orderBy:
                  orderBy === "views"
                    ? { views: "desc" }
                    : orderBy === "purchases"
                      ? { numberOfPurchases: "desc" }
                      : {},
                select: selectProduct,
                take: productCount,
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
                orderBy:
                  orderBy === "views"
                    ? { views: "desc" }
                    : orderBy === "purchases"
                      ? { numberOfPurchases: "desc" }
                      : {},
                select: selectProduct,
                take: productCount,
              },
            },
          })
        )?.brandProducts as ProductCardProps[]);
  return sectionProducts;
}
