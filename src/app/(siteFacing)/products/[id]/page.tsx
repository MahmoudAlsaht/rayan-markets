import db from "@/db/db";
import { ProductCard, ProductCardProps } from "../_components/ProductCard";
import BackButtonNav from "@/components/BackButtonNav";

export default async function ProductDetailsPage({
  params: { id },
}: {
  params: { id: string };
}) {
  const product = await db.product.findUnique({
    where: { id },
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

  return (
    <>
      <div className="sm:hidden">
        <BackButtonNav goHome={false} />
      </div>
      <div className="container h-screen w-full p-0">
        <ProductCard
          product={product as ProductCardProps}
          isProductDetailsPage
        />
      </div>
    </>
  );
}