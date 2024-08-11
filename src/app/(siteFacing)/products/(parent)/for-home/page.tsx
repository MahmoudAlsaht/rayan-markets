import Banner from "@/app/(siteFacing)/_components/Banner";
import { cache } from "@/lib/cache";
import ProductsContainer from "../../_components/ProductsContainer";
import { ProductCardProps } from "../../_components/ProductCard";
import { searchProducts } from "@/app/(siteFacing)/_actions/product";

const getForHome = cache(
  async (productType: string, orderBy?: string, search?: string) =>
    await searchProducts(search, orderBy, productType),
  ["/products/for-home", "getForHome"],
);

export default async function forHomePage({
  searchParams: { orderBy, search },
}: {
  searchParams: { orderBy?: string; search?: string };
}) {
  const forHome = await getForHome("for-home", orderBy, search);

  return (
    <div dir="rtl" className="h-screen">
      <Banner type="forHome" />
      <ProductsContainer products={forHome as ProductCardProps[]} />
      <div className="h-20"></div>
    </div>
  );
}
