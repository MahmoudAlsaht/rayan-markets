"use server";
import { cookies } from "next/headers";
import { getCart } from "./checkCart";
import { Cart, CartProduct } from "../CartContext";

export async function addProductToCart({
  name,
  id,
  price,
  image,
  weight,
}: {
  id: string;
  name: string;
  weight?: number | null;
  price: number;
  image: string;
}) {
  const cart = await getCart();

  const newProduct: CartProduct = {
    id,
    name,
    price,
    image,
    weight,
    counter: 1,
    total: price,
  };

  if (cart == null) {
    return await createNewCart(newProduct);
  }

  return await createNewProductCart(cart, newProduct);
}

async function createNewCart(product: CartProduct) {
  const newCart: Cart = {
    total: product.total,
    products: [product],
  };
  setCartCookie(newCart);
  return newCart.products[0];
}

async function createNewProductCart(cart: Cart, product: CartProduct) {
  const updatedCart: Cart = {
    total: cart.total + product.price,
    products: [...cart.products, product],
  };
  setCartCookie(updatedCart);
  return product;
}

export async function addToProductCounter(id: string) {
  const cart = await getCart();

  if (cart == null) return null;

  const currentCartProduct = cart.products.find((product) => product.id === id);

  if (!currentCartProduct) return null;

  const updatedProduct: CartProduct = {
    ...currentCartProduct,
    counter: currentCartProduct.counter + 1,
    total: currentCartProduct.price * (currentCartProduct.counter + 1),
  };

  const updatedCart: Cart = {
    ...cart,
    total: cart.total + updatedProduct.price,
    products: cart.products.map((currProduct) =>
      currProduct.id === id ? updatedProduct : currProduct,
    ),
  };

  setCartCookie(updatedCart);

  return updatedProduct;
}

export async function takeFromProductCounter(id: string) {
  const cart = await getCart();

  if (cart == null) return null;

  const currentCartProduct = cart.products.find((product) => product.id === id);

  if (!currentCartProduct) return null;

  if (currentCartProduct?.counter - 1 === 0) {
    deleteCartProduct(cart, id);
    return null;
  }

  const updatedProduct: CartProduct = {
    ...currentCartProduct,
    counter: currentCartProduct.counter - 1,
    total: currentCartProduct.price * (currentCartProduct.counter - 1),
  };

  const updatedCart: Cart = {
    ...cart,
    total: cart.total - updatedProduct.price,
    products: cart.products.map((currProduct) =>
      currProduct.id === id ? updatedProduct : currProduct,
    ),
  };

  if (updatedProduct?.counter === 0) {
    deleteCartProduct(cart, id);
    return null;
  }

  setCartCookie(updatedCart);
  return updatedProduct;
}

function deleteCart() {
  cookies().delete("cart");
}

function deleteCartProduct(cart: Cart, id: string) {
  const currentCartProduct = cart.products.find((product) => product.id === id);

  if (!currentCartProduct) return null;

  const updatedCart: Cart = {
    ...cart,
    total: cart.total - currentCartProduct.price,
    products: cart.products.filter((product) => product.id !== id && product),
  };

  updatedCart?.products.length === 0
    ? deleteCart()
    : setCartCookie(updatedCart);
}

function setCartCookie(cart: Cart) {
  const date = new Date();
  date.setTime(date.getTime() + 1000 * 60 * 60 * 24);
  cookies().set("cart", JSON.stringify(cart));
}
