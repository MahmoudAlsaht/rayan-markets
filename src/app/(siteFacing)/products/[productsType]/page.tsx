import ProductsContainer from "../_components/ProductsContainer";
import { ProductCardProps } from "../_components/ProductCard";
import { searchProducts } from "../../_actions/product";
import BackButtonNav from "@/components/BackButtonNav";
import Banner from "../../_components/Banner";
import ProductsMobileContainer from "../_components/ProductsMobileContainer";

const getProducts = async (
  productsType: string,
  orderBy?: string,
  search?: string,
) => await searchProducts(search, orderBy, productsType);

export default async function Products({
  params: { productsType = "any" },
  searchParams: { orderBy, search },
}: {
  params: { productsType: string };
  searchParams: { orderBy?: string; search?: string };
}) {
  const products = await getProducts(productsType, orderBy, search);

  return (
    <div dir="rtl" className="h-screen">
      <div className="sm:hidden">
        <BackButtonNav goHome />
      </div>

      <ProductsMobileContainer
        products={products}
        query={search}
        banner={
          (productsType === "offers" || productsType === "for-home") && (
            <Banner type={productsType === "for-home" ? "forHome" : "offers"} />
          )
        }
      />

      <ProductsContainer products={products as ProductCardProps[]} />

      <div className="h-20"></div>
    </div>
  );
}
