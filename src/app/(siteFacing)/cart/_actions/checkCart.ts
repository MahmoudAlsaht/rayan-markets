"use server";
import { cookies } from "next/headers";

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
