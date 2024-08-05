import { ReactNode, useEffect, useState } from "react";
import { ProductCardProps } from "../../products/_components/ProductCard";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProductsContainer from "../../products/_components/ProductsContainer";
import { TabsContent } from "@radix-ui/react-tabs";

export default function MobileProductsContainer({
  products,
  handleSearchClose,
  type,
  setType,
  banner,
  searching = false,
}: {
  products: ProductCardProps[] | null;
  handleSearchClose?: () => void;
  type: string;
  setType: (type: string) => void;
  banner?: ReactNode;
  searching?: boolean;
}) {
  const [offersExists, setOffersExists] = useState(false);
  const [forHomeExists, setForHomeExists] = useState(false);

  useEffect(() => {
    const isOffer = products?.find((product) => product.isOffer) != null;
    const isForHome =
      products?.find((product) => product.productType === "forHome") != null;
    setOffersExists(isOffer);
    setForHomeExists(isForHome);
  }, [products]);

  return (
    <Tabs defaultValue={type} className="w-full text-center" dir="rtl">
      <TabsList>
        <TabsTrigger onClick={() => setType("all")} value="all">
          كل المنتجات
        </TabsTrigger>
        {!searching && offersExists && (
          <TabsTrigger onClick={() => setType("offers")} value="offers">
            العروض
          </TabsTrigger>
        )}
        {!searching && forHomeExists && (
          <TabsTrigger onClick={() => setType("forHome")} value="forHome">
            المنزلية
          </TabsTrigger>
        )}
      </TabsList>

      <TabsContent value={type}>
        {type !== "all" && banner}
        {products && (
          <ProductsContainer
            handleSearchClose={handleSearchClose}
            products={
              type === "all"
                ? products
                : products.filter((product) =>
                    type === "offers"
                      ? product.isOffer
                      : product.productType === type,
                  )
            }
          />
        )}
      </TabsContent>
    </Tabs>
  );
}
