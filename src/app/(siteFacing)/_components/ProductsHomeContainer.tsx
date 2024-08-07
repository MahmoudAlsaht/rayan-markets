import React from "react";
import db from "@/db/db";
import { cache } from "@/lib/cache";
import { ArrowRightCircle } from "lucide-react";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import {
  ProductCard,
  ProductCardProps,
} from "../products/_components/ProductCard";

const getProducts = cache(
  (type: string) => {
    return db.product.findMany({
      where: { isOffer: type === "newest offers" },
      orderBy:
        type === "views"
          ? { views: "desc" }
          : type === "purchases"
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
      take: 10,
    });
  },
  ["/", "getProducts"],
);

export default async function SectionsHomeContainer({
  type,
}: {
  type: string;
}) {
  const products = await getProducts(type);

  return (
    <section dir="ltr" className="my-6">
      <hr className="my-2 border-slate-300" />
      <div className="mx-2 mb-3 flex items-center justify-between gap-2 sm:mb-6 sm:mt-4">
        <h2 className="text-xs font-semibold capitalize text-rayanPrimary-dark sm:text-2xl">
          {type === "views"
            ? "الأكثر مشاهدة"
            : type === "purchases"
              ? "الأكثر مبيعا"
              : "آخر العروض"}
        </h2>
        <Link
          className="flex gap-2 rounded-3xl bg-rayanPrimary-dark px-3 py-1 text-xs font-medium capitalize leading-6 text-white transition sm:text-sm"
          href={`/products${type === "views" || type === "purchases" ? `?orderBy=${type}` : "/offers?orderBy=createdAt"}`}
        >
          <span>المزيد</span>
          <ArrowRightCircle />
        </Link>
      </div>

      <Carousel
        opts={{
          align: "center",
          loop: true,
          dragFree: true,
          slidesToScroll: "auto",
          duration: 3000,
        }}
        className="w-11/12"
      >
        <CarouselContent>
          {products.map((product) => (
            <CarouselItem
              key={product.id}
              className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/6"
            >
              <ProductCard product={product as ProductCardProps} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  );
}
