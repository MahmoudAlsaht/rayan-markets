"use client";
import { ReactNode, useEffect, useState } from "react";
import { Tabs, TabsList } from "@/components/ui/tabs";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { checkProductTypeExists } from "../../_actions/checkProductsType";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductCard, { ProductCardProps } from "./ProductCard";
import { sortBasedOnPrice } from "../../_actions/product";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Filter } from "lucide-react";

export default function ProductsMobileContainer({
  query = "all",
  products,
  banner,
}: {
  query?: string;
  products: ProductCardProps[];
  banner?: ReactNode;
}) {
  const pathname = usePathname();

  const [offersExists, setOffersExists] = useState(false);
  const [forHomeExists, setForHomeExists] = useState(false);
  const [queryValue, setQueryValue] = useState<string>(
    query === "all" ? "" : query,
  );
  const [priceType, setPriceType] = useState("all");
  const [sortedProducts, setSortedProducts] = useState<
    ProductCardProps[] | null | undefined
  >(null);

  useEffect(() => {
    const checkProductsType = async () => {
      const checkedOffersProduct = await checkProductTypeExists("offers");
      const checkedForHomeProduct = await checkProductTypeExists("forHome");
      setOffersExists(checkedOffersProduct);
      setForHomeExists(checkedForHomeProduct);
    };
    checkProductsType();
    const sortProducts = async () => {
      const fetchedProducts = await sortBasedOnPrice(
        products as ProductCardProps[],
        priceType,
      );
      setSortedProducts(fetchedProducts);
    };
    sortProducts();
  }, [products, priceType]);

  return (
    <>
      <div className="sm:hidden">
        <Tabs className="text-center" dir="rtl">
          <TabsList className="w-full">
            <TabLink
              className={`${pathname === "/products/any" && "bg-background text-rayanPrimary-dark shadow-sm"}`}
              href={`/products/any?search=${query}`}
            >
              كل المنتجات
            </TabLink>
            {offersExists && (
              <TabLink
                className={`${pathname === "/products/offers" && "bg-background text-rayanPrimary-dark shadow-sm"}`}
                href={`/products/offers?search=${query}`}
              >
                العروض
              </TabLink>
            )}
            {forHomeExists && (
              <TabLink
                className={`${pathname === "/products/for-home" && "bg-background text-rayanPrimary-dark shadow-sm"}`}
                href={`/products/for-home?search=${query}`}
              >
                المنزلية
              </TabLink>
            )}
          </TabsList>
        </Tabs>

        <div className="mb-2 flex items-center gap-2">
          <input
            type="text"
            id="search-navbar"
            name="query"
            className="w-full rounded-lg border border-gray-300 bg-gray-50 p-2 ps-10 text-sm text-gray-900 focus:outline-none"
            placeholder="ابحث عن منتج، فئة، علامة تجارية..."
            value={queryValue}
            onChange={(e) => setQueryValue(e.target.value)}
          />
          <Link href={`${pathname}?search=${queryValue}`} className="ml-2">
            <Button size="icon" variant="outline">
              <Search />
            </Button>
          </Link>
          <DropdownMenu dir="rtl">
            <DropdownMenuTrigger className="m-6 sm:hidden">
              <Filter />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setPriceType("highest")}>
                الأعلى سعرا
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setPriceType("lowest")}>
                الأقل سعرا
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      {banner}
      <section className="mb-5 grid w-full grid-cols-2 gap-x-0 gap-y-5 bg-inherit py-6 sm:hidden">
        {sortedProducts?.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </section>
    </>
  );
}

function TabLink({
  href,
  children,
  className,
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  const pathname = usePathname();
  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${className}`}
    >
      {children}
    </Link>
  );
}
