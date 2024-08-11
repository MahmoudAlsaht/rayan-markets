"use client";

import { useEffect, useState, useTransition } from "react";
import ProductCard, { ProductCardProps } from "./ProductCard";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { sortBasedOnPrice } from "../../_actions/product";

export default function ProductsContainer({
  products,
  handleCloseSearch,
}: {
  products: ProductCardProps[];
  handleCloseSearch?: () => void;
}) {
  const [priceType, setPriceType] = useState("all");
  const [sortedProducts, setSortedProducts] = useState<
    ProductCardProps[] | null | undefined
  >(null);

  useEffect(() => {
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
    <main dir="rtl">
      <DropdownMenu dir="rtl">
        <DropdownMenuTrigger className="mr-6">
          <Button variant="outline">
            <Filter />
          </Button>
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

      <section className="mb-5 grid w-full grid-cols-2 gap-x-0 gap-y-5 bg-inherit py-6 sm:mx-auto sm:grid-cols-3 sm:gap-x-2 sm:gap-y-5 md:grid-cols-4 md:gap-2 lg:grid-cols-5">
        {sortedProducts?.map((product) => (
          <ProductCard
            handleCloseSearch={handleCloseSearch}
            key={product.id}
            product={product}
          />
        ))}
      </section>
    </main>
  );
}
