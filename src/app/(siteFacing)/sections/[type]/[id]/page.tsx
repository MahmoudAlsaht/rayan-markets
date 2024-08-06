import Banner from "@/app/(siteFacing)/_components/Banner";
import { ProductCardProps } from "@/app/(siteFacing)/products/_components/ProductCard";
import ProductsContainer from "@/app/(siteFacing)/products/_components/ProductsContainer";
import BackButtonNav from "@/components/BackButtonNav";
import db from "@/db/db";

export default async function SectionsProducts({
  params: { id, type },
}: {
  params: { id: string; type: string };
}) {
  const section = await db.section.findUnique({
    where: { id },
    select: {
      name: true,
      brandProducts: {
        select: {
          id: true,
          image: { select: { path: true } },
          name: true,
          price: true,
          newPrice: true,
          productType: true,
          description: true,
          body: true,
          weights: true,
          isOffer: true,
        },
      },
      categoryProducts: {
        select: {
          id: true,
          image: { select: { path: true } },
          name: true,
          price: true,
          newPrice: true,
          productType: true,
          description: true,
          body: true,
          weights: true,
          isOffer: true,
        },
      },
      sectionBanners: {
        select: {
          id: true,
          path: true,
          link: true,
        },
      },
    },
  });

  return (
    <section>
      <BackButtonNav bg={false} />

      <Banner
        type={`${type === "categories" ? "category" : "brand"}'s Banner`}
        sectionId={id}
      />

      <h1 className="mt-4 text-center text-4xl">{section?.name}</h1>

      <ProductsContainer
        products={
          type === "categories"
            ? (section?.categoryProducts as ProductCardProps[])
            : (section?.brandProducts as ProductCardProps[])
        }
      />
      <div className="h-20"></div>
    </section>
  );
}
