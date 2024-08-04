"use client";
import * as React from "react";
import { Search, X } from "lucide-react";
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
import { useEffect, useState } from "react";
import ProductsContainer from "../products/_components/ProductsContainer";
import { ProductCardProps } from "../products/_components/ProductCard";

export default function SearchProducts({
  allProducts,
  className,
}: {
  allProducts?: ProductCardProps[];
  className?: string;
}) {
  const formRef = React.useRef<HTMLFormElement | null>(null);
  const [value, setValue] = useState<null | string>();
  const [open, setOpen] = useState(false);
  const [{ noProducts, products }, searchAction] = useFormState(
    searchProducts,
    {
      noProducts: true,
      products: [],
    },
  );

  useEffect(() => {
    if (formRef.current) formRef.current.reset();
  }, []);

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
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
                      <div className="relative">
                        <div className="absolute inset-y-0 -start-3 flex items-center ps-3">
                          <SubmitButton
                            body={<Search className="text-white" />}
                            size="sm"
                            className="bg-inherit"
                            handleClick={() => {
                              formRef.current?.requestSubmit();
                              setValue(null);
                            }}
                          />
                        </div>
                        <input
                          type="text"
                          id="search-navbar"
                          name="query"
                          className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2 ps-10 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                          placeholder="...منتج،قسم،علامة تجارية"
                          onChange={(e) => {
                            if (e.target.value) {
                              setValue(e.target.value);
                            }
                          }}
                          onKeyDown={(e) => {
                            if (e.code === "Enter") {
                              formRef.current?.requestSubmit();
                              setValue(null);
                            }
                          }}
                        />
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
            {!allProducts && noProducts && (
              <h1 className="text-center">لم يتم العثور على نتائج</h1>
            )}
            {!allProducts && noProducts && products && (
              <h1 className="mb-8 text-center">انظر منتجاتنا الأخرى</h1>
            )}
            {products && (
              <ProductsContainer
                products={products as ProductCardProps[]}
                handleSearchClose={handleClose}
              />
            )}
            {value == null && allProducts && (
              <>
                <h1 className="text-center text-2xl md:text-4xl">
                  كل المنتجات
                </h1>
                <ProductsContainer
                  products={allProducts as ProductCardProps[]}
                  handleSearchClose={handleClose}
                />
              </>
            )}
          </>
          <div className="h-20"></div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
