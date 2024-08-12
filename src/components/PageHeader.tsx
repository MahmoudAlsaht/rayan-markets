export default function PageHeader({
  title,
  mt,
}: {
  title: string;
  mt?: string | undefined;
}) {
  return (
    <h1 className={`text-center ${mt ? mt : "mt-16"} mb-4 text-4xl`}>
      {title}
    </h1>
  );
}
