"use server";
import { Anonymous, PromoCode } from "@prisma/client";
import { cookies } from "next/headers";

export type CartProduct = {
  id: string;
  name: string;
  weight?: number | null;
  flavor?: string | null;
  price: number;
  total: number;
  quantity: number;
  counter: number;
  limit: number;
  image: string;
};

export type Cart = {
  products: CartProduct[];
  promoCode?: PromoCode;
  anonymous?: Anonymous;
  total: number;
};

export async function getCart() {
  const checkCookies = cookies().get("cart");

  if (!checkCookies?.value) return null;

  const cart = JSON.parse(checkCookies.value);

  if (cart == null) return null;

  return cart as Cart;
}

export async function findProduct(id: string) {
  const cart: Cart | null = await getCart();
  if (cart == null) return null;

  const product = cart.products.find((product) => product.id === id);

  if (product == null) return null;

  return product as CartProduct;
}

export async function updateCart(updatedCart: Cart) {
  cookies().set("cart", JSON.stringify(updatedCart));
}
