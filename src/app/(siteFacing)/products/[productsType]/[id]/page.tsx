import db from "@/db/db";
import BackButtonNav from "@/components/BackButtonNav";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { addHours } from "date-fns";
import { checkUser } from "@/app/(siteFacing)/auth/_actions/isAuthenticated";
import ProductCard, {
  ProductCardProps,
  ProductCardSkeleton,
} from "../../_components/ProductCard";
import ProductsContainer from "../../_components/ProductsContainer";
import { Suspense } from "react";

const getLabels = async (labels: string[], id: string) => {
  db.product.updateMany({
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

  db.product.updateMany({
    where: {
      offerStartsAt: {
        gt: addHours(new Date(), 3),
      },
    },
    data: {
      isOffer: false,
    },
  });

  db.product.updateMany({
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

  let allProductLabels: any[] = [];
  for (const value of labels) {
    const label = await db.label.findFirst({
      where: { value },
      select: {
        id: true,
        value: true,
        products: {
          where: { NOT: { id } },
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
    if (label && label.products.length > 0) {
      allProductLabels.push(label);
    }
  }

  return [
    ...new Map(allProductLabels.map((label) => [label["id"], label])).values(),
  ];
};

export default function ProductsTypePage({
  params: { id },
}: {
  params: { id: string };
}) {
  return (
    <>
      <div className="sm:hidden">
        <BackButtonNav />
      </div>
      <div className="hidden sm:block">
        <BackButtonNav bg={false} />
      </div>

      {/* <ProductCardSkeleton isProductDetailsPage /> */}
      <Suspense fallback={<ProductCardSkeleton isProductDetailsPage />}>
        <ProductDetailsPageSuspense id={id} />
      </Suspense>
      <div className="h-20"></div>
    </>
  );
}

async function ProductDetailsPageSuspense({ id }: { id: string }) {
  const user = await checkUser();
  const product = await db.product.findUnique({
    where: { id },
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
      labels: { select: { value: true } },
      image: {
        select: {
          path: true,
        },
      },
    },
  });

  const labels = (await getLabels(
    product?.labels?.map((label) => label.value) as string[],
    id,
  )) as {
    id: string;
    value: string;
    products: any[];
  }[];

  return (
    <>
      {user && (user.role === "admin" || user.role === "editor") && (
        <Button className="w-full">
          <Link href={`/admin/settings/products/${product?.id as string}`}>
            تعديل المنتج
          </Link>
        </Button>
      )}

      <div className="container w-full p-0">
        <ProductCard
          product={product as ProductCardProps}
          isProductDetailsPage
        />
      </div>

      {labels && labels.length > 0 && (
        <div>
          <h2 className="mb-6 text-center text-lg sm:text-3xl">
            منتجات مشابهة
          </h2>
          {labels?.map((label) => (
            <div key={label.id}>
              <h3 className="text-md text-center sm:text-2xl">{label.value}</h3>
              <ProductsContainer products={label.products} />
            </div>
          ))}
        </div>
      )}
    </>
  );
}
