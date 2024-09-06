"use client";

import ProductsContainer, {
  ProductsContainerSkeleton,
} from "./ProductsContainer";
import React, { useCallback, useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { getProductsForSection, searchProducts } from "../../_actions/product";

export default function ProductsInfiniteScrolling({
  sectionType,
  sectionId,
  productType,
  orderBy,
  query,
  sortPrice,
}: {
  query?: string;
  sectionType?: string;
  sectionId?: string;
  productType?: string;
  orderBy?: string;
  sortPrice?: string;
}) {
  const { ref, inView } = useInView();

  const fetchProducts = useCallback(
    async ({ pageParam = 0 }) => {
      if (productType === "forSectionPage")
        return getProductsForSection(
          pageParam,
          12,
          sectionType,
          sectionId,
          productType,
          orderBy,
        );

      return searchProducts({
        inputQuery: query,
        cursor: pageParam,
        limit: 12,
        productType,
        orderBy,
        sortPrice,
      });
    },
    [orderBy, productType, query, sectionId, sectionType, sortPrice],
  );

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => lastPage.nextCursor,
  });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage]);

  if (status === "pending") return <ProductsContainerSkeleton />;
  if (status === "error") return <div>Error: {(error as Error).message}</div>;

  return (
    <>
      <ProductsContainer data={data} />

      <div ref={ref}>
        {isFetchingNextPage && (
          <div className="flex items-center justify-center space-x-2">
            <span className="sr-only">Loading...</span>
            <div className="h-4 w-4 animate-bounce rounded-full bg-black [animation-delay:-0.3s] sm:h-8 sm:w-8"></div>
            <div className="h-4 w-4 animate-bounce rounded-full bg-black [animation-delay:-0.15s] sm:h-8 sm:w-8"></div>
            <div className="h-4 w-4 animate-bounce rounded-full bg-black sm:h-8 sm:w-8"></div>
          </div>
        )}
      </div>
    </>
  );
}
