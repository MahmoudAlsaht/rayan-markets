"use client";
import { SectionCardProps } from "../sections/_components/SectionCard";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { useState } from "react";
import { LoadingLink } from "@/app/(siteFacing)/_context/LoadingContext";

export default function SectionCarouselCard({
  section,
}: {
  section: SectionCardProps;
}) {
  const [showName, setShowName] = useState(false);

  const handleShowName = () => setShowName(true);
  const handleHideName = () => setShowName(false);

  return (
    <Card
      className="border-0 bg-inherit"
      onMouseOver={handleShowName}
      onMouseLeave={handleHideName}
    >
      <LoadingLink href={`/sections/${section.type}/${section.id}`}>
        <CardContent className="relative flex aspect-square w-full items-center justify-center p-6">
          <Image
            fill
            className="rounded-3xl"
            src={
              section.cover?.path.replace("/upload", "/upload/w_200") as string
            }
            alt={`${section.name}'s image`}
          />
          {showName && (
            <span className="absolute bottom-0 hidden h-full w-full flex-col justify-center rounded-3xl bg-slate-700 bg-opacity-80 p-1 py-0 text-center text-3xl font-semibold text-rayanPrimary-dark sm:flex">
              {section.name}
            </span>
          )}
        </CardContent>
      </LoadingLink>
    </Card>
  );
}
