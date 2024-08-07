"use server";

import db from "@/db/db";
import { addHours } from "date-fns";
import { ProductCardProps } from "../products/_components/ProductCard";

function escapeRegExp(str: string) {
  return str?.replace(/[.@&*+?^${}()|[\]\\]/g, ""); // $& means the whole matched string
}

export async function searchProducts(
  _prevState: unknown,
  formData: FormData,
): Promise<{ products?: ProductCardProps[] | null; noProducts?: boolean }> {
  const query = escapeRegExp(formData.get("query") as string);

  if (query === "" || query == "null") return { noProducts: true };

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

  const brand = await db.section.findFirst({
    where: {
      AND: [
        {
          name: {
            contains: query as string,
          },
          type: {
            equals: "brands",
          },
        },
      ],
    },
    select: {
      brandProducts: {
        select: {
          id: true,
          name: true,
          price: true,
          productType: true,
          newPrice: true,
          weights: true,
          isOffer: true,
          image: {
            select: {
              path: true,
            },
          },
        },
      },
    },
  });

  if (brand && brand.brandProducts.length > 0)
    return { products: brand.brandProducts };

  const category = await db.section.findFirst({
    where: {
      AND: [
        {
          name: {
            contains: query as string,
          },
          type: {
            equals: "categories",
          },
        },
      ],
    },
    select: {
      categoryProducts: {
        select: {
          id: true,
          name: true,
          description: true,
          body: true,
          price: true,
          newPrice: true,
          productType: true,
          weights: true,
          isOffer: true,
          image: {
            select: {
              path: true,
            },
          },
        },
      },
    },
  });

  if (category && category.categoryProducts.length > 0)
    return {
      products: category.categoryProducts,
    };

  const label = await db.label.findFirst({
    where: {
      value: {
        contains: query,
      },
    },
    select: {
      products: {
        select: {
          id: true,
          name: true,
          description: true,
          body: true,
          price: true,
          newPrice: true,
          productType: true,
          weights: true,
          isOffer: true,
          image: {
            select: {
              path: true,
            },
          },
        },
      },
    },
  });

  if (label && label.products.length > 0)
    return {
      products: label.products,
    };

  const products = await db.product.findMany({
    where: {
      OR: [
        {
          name: {
            contains: query as string,
          },
        },
        {
          body: {
            contains: query as string,
          },
        },
      ],
    },
    select: {
      id: true,
      name: true,
      description: true,
      body: true,
      price: true,
      newPrice: true,
      productType: true,
      weights: true,
      isOffer: true,
      image: {
        select: {
          path: true,
        },
      },
    },
  });

  if (products.length === 0) {
    const mostViewedProducts = await db.product.findMany({
      orderBy: { views: "desc" },
      take: 6,
      select: {
        id: true,
        name: true,
        description: true,
        body: true,
        price: true,
        newPrice: true,
        productType: true,
        weights: true,
        isOffer: true,
        image: {
          select: {
            path: true,
          },
        },
      },
    });
    const mostPurchasedProducts = await db.product.findMany({
      orderBy: { numberOfPurchases: "desc" },
      take: 6,
      select: {
        id: true,
        name: true,
        description: true,
        body: true,
        price: true,
        newPrice: true,
        productType: true,
        weights: true,
        isOffer: true,
        image: {
          select: {
            path: true,
          },
        },
      },
    });
    const mostResentProducts = await db.product.findMany({
      orderBy: { createdAt: "desc" },
      take: 6,
      select: {
        id: true,
        name: true,
        description: true,
        body: true,
        price: true,
        newPrice: true,
        productType: true,
        weights: true,
        isOffer: true,
        image: {
          select: {
            path: true,
          },
        },
      },
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
      ],
      noProducts: true,
    };
  }

  return { products: products };
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
