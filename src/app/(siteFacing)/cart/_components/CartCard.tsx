"use client";
import { formatCurrency } from "@/lib/formatters";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";
import { CartProduct } from "@/app/(siteFacing)/cart/_actions/checkCart";
import {
  addToProductCounter,
  deleteCartProduct,
  takeFromProductCounter,
} from "../_actions/cartActions";
import { useTransition } from "react";

export default function CartCard({ product }: { product: CartProduct }) {
  const [_, startTransition] = useTransition();

  const handleAddToCounter = async () => {
    startTransition(async () => {
      await addToProductCounter(product.id);
    });
  };

  const handleTakeFromCounter = async () => {
    startTransition(async () => {
      await takeFromProductCounter(product.id);
    });
  };

  const removeProductFromCart = async () => {
    startTransition(async () => {
      await deleteCartProduct(product.id);
    });
  };

  return (
    <>
      <div className="border-b-1 hidden w-full cursor-pointer rounded-xl border-x-2 border-slate-300 bg-inherit shadow-md shadow-slate-200 duration-500 sm:block sm:hover:scale-105 sm:hover:shadow-xl">
        <div className="relative h-40 w-full">
          <Image
            fill
            priority
            className="rounded-t-xl object-cover duration-500 sm:hover:scale-105 sm:hover:shadow-xl"
            src={(product?.image as string) || ""}
            alt={`${product?.name}'s image`}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute -bottom-4 left-2 w-11/12 rounded-2xl bg-white px-2 py-2 pl-0 shadow-md shadow-slate-200 duration-500 sm:left-0 sm:w-full sm:scale-95 sm:hover:scale-100 sm:hover:shadow-xl">
            {
              <div className="flex w-11/12 items-center justify-between sm:px-6 sm:pl-4">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={handleAddToCounter}
                >
                  <Plus className="size-6 text-rayanPrimary-dark" />
                </Button>
                <span className="text-rayanPrimary-dark">
                  {product?.counter}
                </span>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={handleTakeFromCounter}
                >
                  <Minus className="size-6 text-rayanPrimary-dark" />
                </Button>
              </div>
            }
          </div>
        </div>

        <div className="mt-2 w-full py-3 sm:px-4">
          <p className="text-md mt-2 block truncate text-center font-bold capitalize text-rayanPrimary-dark sm:text-start sm:text-lg">
            {product.flavor ? (
              <>
                {product.name} <span>({product.flavor})</span>
              </>
            ) : product.weight ? (
              <>
                (
                <span>
                  {product.weight === 0.25
                    ? "ربع كيلو"
                    : product.weight === 0.5
                      ? "نصف كيلو"
                      : product.weight === 0.75
                        ? "كيلو الا ربع"
                        : product.weight === 1
                          ? "كيلو"
                          : `${product.weight} كيلو`}
                </span>
                ) {product.name}
              </>
            ) : (
              product?.name
            )}
          </p>
          <div className="mb-6 mt-4 gap-6">
            <p className="sm:text-md my-3 cursor-auto text-sm font-semibold text-rayanSecondary-dark">
              السعر: {formatCurrency(product?.price as number)}
            </p>
            <p className="sm:text-md my-3 cursor-auto text-sm font-semibold text-rayanSecondary-dark">
              المجموع: {formatCurrency(product?.total as number)}
            </p>
          </div>

          <div className="sm:scale-95 sm:duration-500 sm:hover:scale-105">
            <Button
              size="sm"
              variant="destructive"
              onClick={removeProductFromCart}
              className="w-full"
            >
              <Trash2 />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex gap-4 p-2 sm:hidden">
        <div className="relative h-40 w-40">
          <Image
            fill
            priority
            className="rounded-xl object-cover duration-500 sm:hover:scale-105 sm:hover:shadow-xl"
            src={(product?.image as string) || ""}
            alt={`${product?.name}'s image`}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute bottom-0 mt-4 flex h-11 w-full items-center justify-around rounded-xl bg-slate-100">
            <Button
              size="icon"
              variant="secondary"
              onClick={handleAddToCounter}
              className="h-6 w-8 rounded-md bg-white"
            >
              <Plus className="text-rayanPrimary-dark" />
            </Button>
            <span className="text-rayanPrimary-dark">{product?.counter}</span>
            <Button
              size="icon"
              variant="secondary"
              onClick={handleTakeFromCounter}
              className="h-6 w-8 rounded-md bg-white"
            >
              <Minus className="text-rayanPrimary-dark" />
            </Button>
          </div>
        </div>
        <div>
          <p className="text-md mt-2 block truncate font-bold capitalize text-rayanPrimary-dark sm:text-start sm:text-lg">
            {product?.name}
          </p>
          <div className="mb-6 mt-4 gap-6">
            <p className="sm:text-md my-3 cursor-auto text-sm font-semibold text-rayanSecondary-dark">
              السعر: {formatCurrency(product?.price as number)}
            </p>
            <p className="sm:text-md my-3 cursor-auto text-sm font-semibold text-rayanSecondary-dark">
              المجموع: {formatCurrency(product?.total as number)}
            </p>
          </div>
        </div>
      </div>
      <div className="flex justify-center sm:hidden">
        <Button
          size="sm"
          variant="destructive"
          onClick={removeProductFromCart}
          className="w-4/5"
        >
          <Trash2 />
        </Button>
      </div>
      <hr className="mb-5 mt-0 h-1 bg-slate-300 sm:hidden" />
    </>
  );
}

export function CartCardSkeleton() {
  return (
    <div className="rounded-xl border-x-2 border-b-2 border-slate-300 shadow-md shadow-slate-200">
      <div className="h-80 rounded-xl bg-gray-400 object-cover" />
    </div>
  );
}
