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
import { handleSearchInput, sortBasedOnPrice } from "../_actions/product";
import { useEffect, useRef, useState } from "react";
import ProductsContainer from "../products/_components/ProductsContainer";
import { ProductCardProps } from "../products/_components/ProductCard";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function SearchProducts({ className }: { className?: string }) {
  const formRef = React.useRef<HTMLFormElement | null>(null);
  const [priceType, setPriceType] = useState("all");
  const [sortedProducts, setSortedProducts] = useState<
    ProductCardProps[] | null | undefined
  >(null);
  const [open, setOpen] = useState(false);
  const queryRef = useRef<HTMLInputElement | null>(null);

  const [products, searchAction] = useFormState(handleSearchInput, null);

  useEffect(() => {
    if (formRef.current) formRef.current.reset();
  }, []);

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

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
    <Drawer open={open} onClose={handleClose}>
      <DrawerTrigger className={className} onClick={handleOpen}>
        <Search />
      </DrawerTrigger>
      <DrawerContent dir="ltr">
        <div className="mx-auto w-full overflow-auto">
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
                            onKeyDown={(e) => {
                              if (e.code === "Enter") {
                                formRef.current?.requestSubmit();
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

          <>
            {products && (
              <ProductsContainer
                handleCloseSearch={handleClose}
                products={sortedProducts as ProductCardProps[]}
              />
            )}
          </>
          <div className="h-20"></div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
