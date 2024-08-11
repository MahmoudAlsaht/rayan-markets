import { cache } from "@/lib/cache";
import ProductsContainer from "../_components/ProductsContainer";
import { ProductCardProps } from "../_components/ProductCard";
import { searchProducts } from "../../_actions/product";

const getProducts = cache(
  async (orderBy?: string, search?: string) =>
    await searchProducts(search, orderBy),
  ["/products", "getProducts"],
);

export default async function Products({
  searchParams: { orderBy, search },
}: {
  searchParams: { orderBy?: string; search?: string };
}) {
  const products = await getProducts(orderBy, search);

  return (
    <div dir="rtl" className="h-screen">
      <ProductsContainer products={products as ProductCardProps[]} />
      <div className="h-20"></div>
    </div>
  );
}
