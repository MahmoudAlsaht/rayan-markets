// import CartContainer from "./_components/CartContainer";
// import { redirect } from "next/navigation";
// import { cookies } from "next/headers";
// import { Cart } from "@/context/cart/CartContext";

export default async function CartPage() {
  // const checkCookies = cookies().get("cart");

  // if (checkCookies == null) redirect("/");

  // const cart: Cart = JSON.parse(checkCookies.value);

  // if (!cart) redirect("/");

  return (
    <div className="mt-64 flex flex-col items-center text-3xl">السلة فارغة</div>
    // <div className="">
    //   <CartContainer cart={cart} />
    // </div>
  );
}
