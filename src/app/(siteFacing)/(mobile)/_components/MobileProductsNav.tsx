"use client";
import { ReactNode, useEffect, useRef, useState } from "react";
import { Tabs, TabsList } from "@/components/ui/tabs";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { checkProductTypeExists } from "../../_actions/checkProductsType";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MobileProductsContainer({
  query = "all",
}: {
  query?: string;
}) {
  const [offersExists, setOffersExists] = useState(false);
  const [forHomeExists, setForHomeExists] = useState(false);
  const [queryValue, setQueryValue] = useState<string>(
    query === "all" ? "" : query,
  );

  useEffect(() => {
    const checkProductsType = async () => {
      const checkedOffersProduct = await checkProductTypeExists("offers");
      const checkedForHomeProduct = await checkProductTypeExists("forHome");
      setOffersExists(checkedOffersProduct);
      setForHomeExists(checkedForHomeProduct);
    };
    checkProductsType();
  }, []);

  const pathname = usePathname();

  return (
    <div>
      <Tabs className="text-center" dir="rtl">
        <TabsList className="w-full">
          <TabLink
            className={`${pathname === "/products" && "bg-background text-rayanPrimary-dark shadow-sm"}`}
            href={`/products?search=${query}`}
          >
            كل المنتجات
          </TabLink>
          {offersExists && (
            <TabLink
              className={`${pathname === "/products/offers" && "bg-background text-rayanPrimary-dark shadow-sm"}`}
              href={`/products/offers?=${query}`}
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
      </div>
    </div>
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
