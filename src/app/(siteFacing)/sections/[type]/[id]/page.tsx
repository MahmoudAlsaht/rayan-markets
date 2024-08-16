import Banner from "@/app/(siteFacing)/_components/Banner";
import { ProductCardProps } from "@/app/(siteFacing)/products/_components/ProductCard";
import ProductsContainer, {
  ProductsContainerSkeleton,
} from "@/app/(siteFacing)/products/_components/ProductsContainer";
import BackButtonNav from "@/components/BackButtonNav";
import db from "@/db/db";
import { Section } from "@prisma/client";
import { Suspense } from "react";

const getSectionBanners = (id: string) => {
  return db.section.findUnique({
    where: { id },
    select: {
      name: true,
      sectionBanners: {
        select: {
          id: true,
          path: true,
          link: true,
        },
      },
    },
  });
};

const getSectionProducts = (id: string) => {
  return db.section.findUnique({
    where: { id },
    select: {
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
    },
  });
};

export default function SectionProducts({
  params: { id, type },
}: {
  params: { id: string; type: string };
}) {
  return (
    <section>
      <BackButtonNav />
      <Suspense>
        <SectionBannersSuspense id={id} type={type} />
      </Suspense>
      <Suspense fallback={<ProductsContainerSkeleton />}>
        <SectionProductsSuspense id={id} type={type} />
      </Suspense>
      <div className="h-20"></div>
    </section>
  );
}

type SectionProducts = Partial<Section> & {
  name: string;
  brandProducts: ProductCardProps[];
  categoryProducts: ProductCardProps[];
  sectionBanners: {
    id: string;
    path: string;
    link: string;
  }[];
};

async function SectionBannersSuspense({
  id,
  type,
}: {
  id: string;
  type: string;
}) {
  const section = (await getSectionBanners(id)) as any;

  return (
    <>
      <Banner
        type={`${type === "categories" ? "category" : "brand"}'s Banner`}
        sectionId={id}
        sectionBanners={(section as SectionProducts)?.sectionBanners?.map(
          (banner, index) => ({
            id: `${index}-${section.name}-${type}`,
            path: banner.path,
            link: banner.link as string,
          }),
        )}
      />
      <h1 className="mt-4 text-center text-4xl">{section?.name}</h1>
    </>
  );
}

async function SectionProductsSuspense({
  id,
  type,
}: {
  id: string;
  type: string;
}) {
  const section = (await getSectionProducts(id)) as any;
  return (
    <>
      <ProductsContainer
        products={
          type === "categories"
            ? ((section as SectionProducts)
                ?.categoryProducts as ProductCardProps[])
            : ((section as SectionProducts)
                ?.brandProducts as ProductCardProps[])
        }
      />
    </>
  );
}
