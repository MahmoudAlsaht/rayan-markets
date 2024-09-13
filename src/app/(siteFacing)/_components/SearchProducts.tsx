"use client";
import * as React from "react";
import { Filter, Loader2, Search, X } from "lucide-react";
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
import { useEffect, useState } from "react";
import ProductsContainer from "../products/_components/ProductsContainer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ProductCardProps } from "../products/[productType]/[id]/page";

export default function SearchProducts({ className }: { className?: string }) {
  const formRef = React.useRef<HTMLFormElement | null>(null);
  const [priceType, setPriceType] = useState("all");
  const [sortedProducts, setSortedProducts] = useState<
    ProductCardProps[] | null | undefined
  >(null);
  const [open, setOpen] = useState(false);

  const [pending, startSearching] = React.useTransition();

  const [data, searchAction] = useFormState(handleSearchInput, null);

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
        data?.products as ProductCardProps[],
        priceType,
      );
      setSortedProducts(fetchedProducts);
    };
    sortProducts();
  }, [data, priceType]);

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
                <div className="flex items-center justify-between md:mx-auto md:flex-wrap md:p-4">
                  <div className="w-1/3">
                    <div className="flex w-full items-center gap-2">
                      <DropdownMenu dir="rtl">
                        <DropdownMenuTrigger
                          asChild
                          className="m-2 h-9 w-12 cursor-pointer rounded-lg border border-rayanPrimary-dark bg-slate-50 p-1 hover:bg-rayanPrimary-dark hover:text-slate-50"
                        >
                          <Filter className="size-7" />
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
                      <form
                        dir="rtl"
                        className="relative"
                        action={searchAction}
                        ref={formRef}
                        onSubmit={() => {
                          startSearching(
                            async () => await formRef.current?.requestSubmit(),
                          );
                        }}
                      >
                        <input
                          type="text"
                          id="search-navbar"
                          name="query"
                          className="w-full rounded-lg border border-gray-300 bg-gray-50 p-2 ps-9 text-sm text-gray-900"
                          placeholder="منتج،قسم،علامة تجارية ...."
                        />
                        <Button
                          type="submit"
                          variant="outline"
                          size="icon"
                          className="absolute start-0 top-0 cursor-pointer rounded-lg border-none bg-inherit p-2"
                        >
                          <Search />
                        </Button>
                      </form>
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
              </nav>
            </DrawerTitle>
          </DrawerHeader>
          <DrawerDescription />

          {pending ? (
            <div className="flex h-screen items-center justify-center">
              <Loader2 className="size-24 animate-spin text-rayanPrimary-dark dark:text-rayanPrimary-light" />
            </div>
          ) : (
            <>
              {data?.products && (
                <ProductsContainer
                  handleClose={handleClose}
                  products={sortedProducts as ProductCardProps[]}
                />
              )}
            </>
          )}
          <div className="h-20"></div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
