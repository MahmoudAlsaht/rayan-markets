"use client";
import { useState, useTransition } from "react";
import { ProductCardProps } from "../[productsType]/[id]/page";
import ProductMenuPrice from "./ProductMenuPrice";
import {
  addProductToCart,
  addToProductCounter,
  takeFromProductCounter,
} from "../../cart/_actions/cartActions";
import { CartProduct } from "../../cart/_actions/checkCart";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";

export default function HandleCartActions({
  product,
  productInCart,
}: {
  product: ProductCardProps;
  productInCart: CartProduct | null;
}) {
  const [_, startTransition] = useTransition();

  const handleAddToCart = (selectedOption?: number | string) => {
    if (product?.quantity < 1) return;
    startTransition(async () => {
      await addProductToCart({ ...product, selectedOption });
    });
  };

  const handleAddToCounter = () => {
    if ((productInCart?.quantity || 0) < 1) return;
    startTransition(async () => {
      await addToProductCounter(product?.id as string);
    });
  };

  const handleTakeFromCounter = () => {
    startTransition(async () => {
      await takeFromProductCounter(product?.id as string);
    });
  };

  return (
    <div className="relative text-rayanPrimary-dark">
      {!productInCart && (
        <ProductMenuPrice
          disabled={product?.quantity < 1}
          flavors={
            product?.flavors && product?.flavors.length
              ? product?.flavors
              : null
          }
          weights={
            product?.weights && product?.weights.length
              ? product?.weights
              : null
          }
          handleAddToCart={handleAddToCart}
        />
      )}
      {productInCart && (
        <div className="flex items-center justify-around">
          <Button
            variant="outline"
            className="bg-slate-100 hover:bg-slate-100"
            onClick={handleAddToCounter}
            disabled={(productInCart?.limit || 0) < 1}
          >
            <Plus className="size-7 text-rayanPrimary-dark" />
          </Button>
          <span className="text-rayanPrimary-dark">
            {productInCart?.counter || 0}
          </span>
          <Button
            variant="outline"
            className="bg-slate-100 hover:bg-slate-100"
            onClick={handleTakeFromCounter}
          >
            <Minus className="size-7 text-rayanPrimary-dark" />
          </Button>
        </div>
      )}
    </div>
  );
}
