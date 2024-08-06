import React from "react";
import db from "@/db/db";
import { cache } from "@/lib/cache";
import { ArrowRightCircle } from "lucide-react";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import SectionCarouselCard from "./SectionCarouselCard";
import { SectionCardProps } from "../sections/_components/SectionCard";

const getSections = cache(
  (type: string) => {
    return db.section.findMany({
      where: { type },
      select: {
        id: true,
        name: true,
        cover: {
          select: {
            path: true,
          },
        },
      },
    });
  },
  ["/", "getSections"],
);

export default async function SectionsHomeContainer({
  type,
}: {
  type: string;
}) {
  const sections = await getSections(type);

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
          {sections.map(
            (section, index) =>
              index < 10 && (
                <CarouselItem
                  key={section.id}
                  className="basis-1/3 sm:basis-1/4 md:basis-1/6"
                >
                  <div className="p-1">
                    <SectionCarouselCard
                      section={section as SectionCardProps}
                    />
                  </div>
                </CarouselItem>
              ),
          )}
        </CarouselContent>
      </Carousel>
    </section>
  );
}
