import Banner from "@/app/(siteFacing)/_components/Banner";
import ProductsContainer from "../../_components/ProductsContainer";
import { ProductCardProps } from "../../_components/ProductCard";
import { searchProducts } from "@/app/(siteFacing)/_actions/product";

const getOffers = async (
  productType: string,
  orderBy?: string,
  search?: string,
) => await searchProducts(search, orderBy, productType);

export default async function OffersPage({
  searchParams: { orderBy, search },
}: {
  searchParams: { orderBy?: string; search?: string };
}) {
  const offers = await getOffers("offers", orderBy, search);

  return (
    <div dir="rtl" className="h-screen">
      <Banner type="offers" />

      <ProductsContainer products={offers as ProductCardProps[]} />
      <div className="h-20"></div>
    </div>
  );
}
