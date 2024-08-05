import db from "@/db/db";
import { ProductCardProps } from "../_components/ProductCard";
import ProductsContainer from "../_components/ProductsContainer";

export default async function forHomePage() {
  const products = await db.product.findMany({
    where: { productType: "forHome" },
    select: {
      id: true,
      name: true,
      price: true,
      newPrice: true,
      weights: true,
      isOffer: true,
      productType: true,
      image: {
        select: {
          path: true,
        },
      },
    },
  });

  return (
    <div dir="rtl" className="h-screen">
      <ProductsContainer products={products as ProductCardProps[]} />
      <div className="h-20"></div>
    </div>
  );
}
