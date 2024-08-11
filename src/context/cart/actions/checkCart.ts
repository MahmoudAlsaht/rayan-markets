"use server";
import { cookies } from "next/headers";
import { Cart, CartProduct } from "../CartContext";

export async function getCart() {
  const checkCookies = cookies().get("cart");

  if (checkCookies == null) return null;

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
