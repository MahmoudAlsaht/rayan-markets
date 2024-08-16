"use server";

import db from "@/db/db";
import { addHours } from "date-fns";
import { ProductCardProps } from "../products/_components/ProductCard";

function escapeRegExp(str: string) {
  return str?.replace(/[.@&*+?^${}()|[\]\\]/g, ""); // $& means the whole matched string
}

export async function handleSearchInput(
  _prevState: unknown,
  formData: FormData,
): Promise<ProductCardProps[] | null> {
  const query = escapeRegExp(formData.get("query") as string);

  if (query === "" || query == null) {
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

    return [
      ...new Map(
        [
          ...mostPurchasedProducts,
          ...mostViewedProducts,
          ...mostResentProducts,
        ].map((product) => [product["id"], product]),
      ).values(),
    ];
  }

  const result = await searchProducts(query);

  if (result.length === 0) return result;

  const products = await db.product.findMany({
    where: {
      OR: [
        {
          name: {
            contains: query as string,
            mode: "insensitive",
          },
        },
        {
          body: {
            contains: query as string,
            mode: "insensitive",
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

    return [
      ...new Map(
        [
          ...mostPurchasedProducts,
          ...mostViewedProducts,
          ...mostResentProducts,
        ].map((product) => [product["id"], product]),
      ).values(),
    ];
  }

  return products;
}

export async function searchProducts(
  inputQuery = "all",
  orderBy = "",
  productType = "any",
  productCount: number | undefined = undefined,
) {
  const query = escapeRegExp(inputQuery);

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

  if (!query || query == "all" || query === "") {
    return await db.product.findMany({
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
      take: productCount,
    });
  }

  const brand = await db.section.findFirst({
    where: {
      AND: [
        {
          name: {
            contains: query as string,
            mode: "insensitive",
          },
          type: {
            equals: "brands",
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
        take: productCount,
      },
    },
  });

  if (brand && brand.brandProducts.length > 0) return brand.brandProducts;

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
          isOffer: true,
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

  if (category && category.categoryProducts.length > 0)
    return category.categoryProducts;

  const label = await db.label.findFirst({
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
          isOffer: true,
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

  if (label && label.products.length > 0) return label.products;

  const products = await db.product.findMany({
    where: {
      AND: [
        productType === "for-home"
          ? { productType: "forHome" }
          : productType === "offers"
            ? { isOffer: true }
            : {},
        {
          OR: [
            {
              name: {
                contains: query as string,
                mode: "insensitive",
              },
            },
            {
              body: {
                contains: query as string,
                mode: "insensitive",
              },
            },
          ],
        },
      ],
    },
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
      isOffer: true,
      image: {
        select: {
          path: true,
        },
      },
    },
    take: productCount,
  });

  if (products.length === 0) {
    return await db.product.findMany({
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
        isOffer: true,
        image: {
          select: {
            path: true,
          },
        },
      },
      take: productCount,
    });
  }

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
