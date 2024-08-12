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
    <div className="cursor-pointer rounded-xl border-x-2 border-b-2 border-slate-300 bg-inherit shadow-md shadow-slate-200 duration-500 sm:hover:scale-105 sm:hover:shadow-xl">
      <div className="relative h-44">
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
              <span className="text-rayanPrimary-dark">{product?.counter}</span>
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
          {product?.name}
        </p>
        <div className="mt-4 flex items-center justify-center gap-6">
          <div className="flex items-center justify-around sm:gap-2 md:justify-start">
            <p className="sm:text-md my-3 cursor-auto text-sm font-semibold text-rayanSecondary-dark">
              المجموع: {formatCurrency(product?.total as number)}
            </p>
          </div>
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
  );
}
