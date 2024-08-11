"use client";
import React, { useEffect, useState } from "react";
import { createContext, useContext, ReactNode } from "react";
import { findProduct, getCart } from "./actions/checkCart";
import {
  addProductToCart,
  addToProductCounter,
  takeFromProductCounter,
} from "./actions/addToCart";
import { ProductCardProps } from "@/app/(siteFacing)/products/_components/ProductCard";

export type CartProduct = {
  id: string;
  name: string;
  weight?: number | null;
  price: number;
  total: number;
  counter: number;
  image: string;
};

export type Cart = {
  products: CartProduct[];
  total: number;
};

type CartContextType = {
  fetchCart: () => Promise<Cart | null>;
  getProduct: (id: string) => Promise<CartProduct | null>;
  addProduct: (
    data: ProductCardProps & {
      selectedWeight?: number;
    },
  ) => Promise<CartProduct>;
  toggleProductCounter: (
    id: string,
    action: string,
  ) => Promise<CartProduct | null>;
};

const CartContext = createContext({} as CartContextType);

export function useCart() {
  return useContext(CartContext);
}

type CartProviderProps = {
  children: ReactNode;
};

export default function CartProvider({ children }: CartProviderProps) {
  const fetchCart = async () => {
    return await getCart();
  };

  const getProduct = async (id: string) => {
    return await findProduct(id);
  };

  const addProduct = async (
    data: ProductCardProps & { selectedWeight?: number },
  ) => {
    const priceOrNewPrice = data.isOffer
      ? (data.newPrice as number)
      : (data.price as number);
    const price =
      data.productType === "weight" && data.selectedWeight
        ? priceOrNewPrice * data.selectedWeight
        : priceOrNewPrice;
    const name = data.name;
    const weight = data.selectedWeight || null;
    return await addProductToCart({
      id: data.id as string,
      image: data.image?.path as string,
      price: price as number,
      name: name as string,
      weight: weight,
    });
  };

  const toggleProductCounter = async (id: string, action: string) => {
    if (action === "add") {
      return await addToProductCounter(id);
    }
    return await takeFromProductCounter(id);
  };

  return (
    <CartContext.Provider
      value={{
        fetchCart,
        getProduct,
        addProduct,
        toggleProductCounter,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
