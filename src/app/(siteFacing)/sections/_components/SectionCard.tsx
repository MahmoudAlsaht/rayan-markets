import Link from "next/link";
import Image from "next/image";

export type SectionCardProps = {
  id: string;
  name: string;
  type: string;
  cover: {
    path: string;
  } | null;
};

export default function SectionCard({
  section,
}: {
  section: SectionCardProps;
}) {
  return (
    <div className="cursor-pointer rounded-3xl duration-500 sm:w-full sm:hover:scale-105 sm:hover:shadow-xl">
      <Link href={`/sections/${section.type}/${section.id}`}>
        <div className="relative h-24 sm:h-44">
          <Image
            fill
            priority
            className="rounded-3xl object-cover"
            src={section?.cover?.path as string}
            alt={`${section.name}'s image`}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <h3 className="text-center text-lg sm:text-2xl">{section.name}</h3>
      </Link>
    </div>
  );
}