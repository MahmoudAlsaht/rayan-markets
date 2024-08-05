"use client";
import * as React from "react";
import { Filter, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useFormState } from "react-dom";
import { searchProducts } from "../_actions/product";
import SubmitButton from "@/components/SubmitButton";
import { ReactNode, useEffect, useRef, useState } from "react";
import ProductsContainer from "../products/_components/ProductsContainer";
import { ProductCardProps } from "../products/_components/ProductCard";
import MobileProductsContainer from "../(mobile)/_components/MobileProductsContainer";
import {
  DropdownMenu,
  DropdownMenuContent,
} from "@radix-ui/react-dropdown-menu";
import {
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function SearchProducts({
  allProducts,
  className,
  offersBanner,
  forHomeBanner,
}: {
  allProducts?: ProductCardProps[];
  className?: string;
  offersBanner?: ReactNode;
  forHomeBanner?: ReactNode;
}) {
  const formRef = React.useRef<HTMLFormElement | null>(null);
  const [type, setType] = useState("all");
  const [priceType, setPriceType] = useState("all");
  const [searching, setSearching] = useState(false);
  const [open, setOpen] = useState(false);
  const queryRef = useRef<HTMLInputElement | null>(null);

  const [{ noProducts, products }, searchAction] = useFormState(
    searchProducts,
    {},
  );

  const sortBasedOnPrice = (products: ProductCardProps[], orderBy: string) => {
    return orderBy === "highest"
      ? products?.toSorted(
          (a, b) =>
            ((b?.newPrice as number) || (b?.price as number)) -
            ((a.newPrice as number) || (a?.price as number)),
        )
      : orderBy === "lowest"
        ? products?.toSorted(
            (a, b) =>
              ((a?.newPrice as number) || (a?.price as number)) -
              ((b.newPrice as number) || (b?.price as number)),
          )
        : products;
  };

  useEffect(() => {
    if (formRef.current) formRef.current.reset();
  }, []);

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleSetType = (type: string) => {
    setType(type);
  };

  return (
    <Drawer open={open} onClose={handleClose}>
      <DrawerTrigger className={className} onClick={handleOpen}>
        <Search />
      </DrawerTrigger>
      <DrawerContent dir="ltr" className="h-screen">
        <div className="overflow-auto rounded-t-[10px] md:p-4">
          <DrawerHeader>
            <DrawerTitle>
              <nav>
                <form action={searchAction} ref={formRef}>
                  <div className="flex items-center justify-between md:mx-auto md:flex-wrap md:p-4">
                    <div className="flex">
                      <div className="">
                        <div className="flex gap-4">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Filter />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem
                                onClick={() => setPriceType("highest")}
                              >
                                الأعلى سعرا
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => setPriceType("lowest")}
                              >
                                الأقل سعرا
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                          <input
                            type="text"
                            id="search-navbar"
                            name="query"
                            className="w-full rounded-lg border border-gray-300 bg-gray-50 p-2 ps-10 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                            placeholder="...منتج،قسم،علامة تجارية"
                            ref={queryRef}
                            onChange={(e) => {
                              if (!e.target.value) setSearching(false);
                            }}
                            onKeyDown={(e) => {
                              if (e.code === "Enter") {
                                formRef.current?.requestSubmit();
                                if (queryRef.current?.value) setSearching(true);
                              }
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    <Button
                      className="order-2"
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={handleClose}
                    >
                      <X />
                    </Button>
                  </div>
                </form>
              </nav>
            </DrawerTitle>
          </DrawerHeader>
          <DrawerDescription />

          <legend className="sm:hidden">
            {
              <MobileProductsContainer
                banner={
                  (type === "offers" && offersBanner) ||
                  (type === "forHome" && forHomeBanner)
                }
                type={type}
                setType={handleSetType}
                handleSearchClose={handleClose}
                products={
                  searching
                    ? sortBasedOnPrice(
                        products as ProductCardProps[],
                        priceType,
                      )
                    : sortBasedOnPrice(
                        allProducts as ProductCardProps[],
                        priceType,
                      )
                }
                searching={searching}
              />
            }
          </legend>

          <>
            <legend className="hidden sm:block">
              {!allProducts && noProducts && (
                <h1 className="text-center">لم يتم العثور على نتائج</h1>
              )}
              {!allProducts && noProducts && products && (
                <h1 className="text-center">انظر منتجاتنا الأخرى</h1>
              )}

              {products && (
                <ProductsContainer
                  products={sortBasedOnPrice(
                    products as ProductCardProps[],
                    priceType,
                  )}
                  handleSearchClose={handleClose}
                />
              )}
            </legend>
          </>
          <div className="h-20"></div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
