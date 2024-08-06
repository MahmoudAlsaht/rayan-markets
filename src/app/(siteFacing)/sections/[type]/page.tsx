import db from "@/db/db";
import { cache } from "@/lib/cache";
import SectionsContainer from "../_components/SectionsContainer";
import { notFound } from "next/navigation";
import { SectionCardProps } from "../_components/SectionCard";
import BackButtonNav from "@/components/BackButtonNav";

const getSections = cache(
  (type: string) => {
    return db.section.findMany({
      where: { type },
      select: {
        id: true,
        name: true,
        type: true,
        cover: {
          select: {
            path: true,
          },
        },
      },
    });
  },
  ["/sections", "getSections"],
);

export default async function SectionsPage({
  params: { type },
}: {
  params: { type: string };
}) {
  if (type !== "categories" && type !== "brands") return notFound();

  const sections = await getSections(type);

  return (
    <div dir="rtl" className="h-screen pb-16 sm:px-6">
      <div className="sm:hidden">
        <BackButtonNav goHome />
      </div>
      <h1 className="mb-4 mt-10 text-center text-4xl">
        {type === "categories" ? "الفئات" : "العلامات التجارية"}
      </h1>
      <SectionsContainer sections={sections as SectionCardProps[]} />
      <div className="h-20"></div>
    </div>
  );
}
