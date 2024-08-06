import SectionCard, { SectionCardProps } from "./SectionCard";

export default function SectionsContainer({
  sections,
}: {
  sections: SectionCardProps[];
}) {
  return (
    <section
      dir="rtl"
      className="mb-5 grid w-full grid-cols-4 gap-x-1 gap-y-5 bg-inherit sm:gap-x-2 sm:gap-y-5 sm:py-6 md:grid-cols-5 md:gap-2 lg:grid-cols-6"
    >
      {sections.map((section) => (
        <SectionCard key={section.id} section={section} />
      ))}
    </section>
  );
}
