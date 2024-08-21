import ProductsContainer, {
  ProductsContainerSkeleton,
} from "../_components/ProductsContainer";
import { ProductCardProps } from "../_components/ProductCard";
import { searchProducts } from "../../_actions/product";
import BackButtonNav from "@/components/BackButtonNav";
import Banner from "../../_components/Banner";
import ProductsMobileContainer from "../_components/ProductsMobileContainer";
import { Suspense } from "react";
import db from "@/db/db";

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
  return (
    <div dir="rtl" className="h-screen">
      <div className="sm:hidden">
        <BackButtonNav goHome />
      </div>

      <ProductsMobileSuspense
        productsType={productsType}
        orderBy={orderBy}
        search={search}
      />

      <Suspense fallback={<ProductsContainerSkeleton />}>
        <ProductsSuspense
          productsType={productsType}
          orderBy={orderBy}
          search={search}
        />
      </Suspense>

      <div className="h-20"></div>
    </div>
  );
}

async function ProductsMobileSuspense({
  productsType = "any",
  orderBy,
  search,
}: {
  productsType: string;
  orderBy?: string;
  search?: string;
}) {
  const products = await getProducts(productsType, orderBy, search);
  const forHomeProducts = await db.product.findFirst({
    where: { productType: "forHome" },
  });
  const offers = await db.product.findFirst({ where: { isOffer: true } });
  return (
    <>
      <ProductsMobileContainer
        offersExists={offers !== null}
        forHomeExists={forHomeProducts !== null}
        products={products}
        query={search}
        banner={
          (productsType === "offers" || productsType === "for-home") && (
            <Banner type={productsType === "for-home" ? "forHome" : "offers"} />
          )
        }
      />
    </>
  );
}

async function ProductsSuspense({
  productsType = "any",
  orderBy,
  search,
}: {
  productsType: string;
  orderBy?: string;
  search?: string;
}) {
  const products = await getProducts(productsType, orderBy, search);
  return (
    <>
      <legend className="hidden sm:block">
        <ProductsContainer products={products as ProductCardProps[]} />
      </legend>
    </>
  );
}
