"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ComponentProps } from "react";
import { CiDeliveryTruck } from "react-icons/ci";
import { SlOptions } from "react-icons/sl";
import { ImHome } from "react-icons/im";
import { Search, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";
import { Cart, useCart } from "@/context/cart/CartContext";

export default function BottomNavLinks({ user }: { user }) {
  const [cart, setCart] = useState<Cart | null>(null);

  const { fetchCart } = useCart();
  const pathname = usePathname();

  useEffect(() => {
    const getCart = async () => {
      const cart = await fetchCart();
      setCart(cart);
    };
    getCart();
  }, []);

  return (
    <div
      className={`mx-auto grid h-full max-w-lg ${user && cart ? "grid-cols-5" : user || cart ? "grid-cols-4" : "grid-cols-3"}`}
    >
      <NavLink href="/">
        <ImHome className="size-6" />
        {pathname === "/" && <span className="text-xs">الرئيسية</span>}
      </NavLink>

      <NavLink href="/products?search=all">
        <Search className="size-6" />
        {pathname.match(/\/products*/) && (
          <span className="text-xs">المنتجات</span>
        )}
      </NavLink>

      {cart && (
        <NavLink href="/cart" className="relative">
          <ShoppingBag className="size-6" />
          {pathname === "/cart" && <span className="text-xs">السلة</span>}
        </NavLink>
      )}

      {user && (
        <NavLink href={`/account/${user?.profile?.id}/orders`}>
          <CiDeliveryTruck className="size-7" />
          {pathname === `/account/${user?.profile?.id}/orders` && (
            <span className="text-xs">طلباتي</span>
          )}
        </NavLink>
      )}

      <NavLink href="/options">
        <SlOptions className="size-7" />
        {pathname === "/options" && <span className="text-xs">الخيارات</span>}
      </NavLink>
    </div>
  );
}

function NavLink(props: Omit<ComponentProps<typeof Link>, "classNameName">) {
  const pathname = usePathname();

  return (
    <Link
      replace
      {...props}
      className={cn(
        "group inline-flex flex-col items-center justify-center px-5",
        (pathname === props.href ||
          ((props.href as string).match(/\/products*/) &&
            pathname.match(/\/products*/))) &&
          "bg-slate-300 text-rayanPrimary-dark",
      )}
    />
  );
}
