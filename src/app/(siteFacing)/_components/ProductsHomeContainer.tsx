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
import SectionCarouselCard from "./SectionCarouselCard";
import { SectionCardProps } from "../sections/_components/SectionCard";
import {
  ProductCard,
  ProductCardProps,
} from "../products/_components/ProductCard";

const getProducts = cache(
  (type: string) => {
    return db.product.findMany({
      orderBy:
        type === "views"
          ? { views: "desc" }
          : type === "purchases"
            ? { numberOfPurchases: "desc" }
            : { createdAt: "desc" },
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
    <section className="container" dir="ltr">
      <div className="mb-3 flex items-center justify-between gap-2 sm:mb-6 sm:mt-4">
        <h2 className="text-md font-semibold capitalize text-rayanPrimary-dark sm:text-2xl">
          {type === "brands" ? "العلامات التجارية" : "الفئات"}
        </h2>
        <Link
          className="flex gap-2 rounded-3xl bg-rayanPrimary-dark px-3 py-1 text-xs font-medium capitalize leading-6 text-white transition sm:text-sm"
          href={`/sections/${type}`}
        >
          <span>المزيد</span>
          <ArrowRightCircle />
        </Link>
      </div>

      <Carousel opts={{ align: "start", loop: true }} className="w-11/12">
        <CarouselContent>
          {products.map((product) => (
            <CarouselItem
              key={product.id}
              className="basis-1/3 sm:basis-1/4 md:basis-1/6"
            >
              <div className="p-1">
                <ProductCard product={product as ProductCardProps} />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  );
}
