"use client";
import React, { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { CiDeliveryTruck } from "react-icons/ci";
import { SlOptions } from "react-icons/sl";
import { ImHome } from "react-icons/im";
import { Search, ShoppingBag } from "lucide-react";
import { Cart } from "@/app/(siteFacing)/cart/_actions/checkCart";
import { LoadingLink } from "@/context/LoadingContext";

export default function BottomNavLinks({
  user,
  cart,
}: {
  user;
  cart: Cart | null;
}) {
  return (
    <div
      className={`mx-auto grid h-full max-w-lg ${user && cart ? "grid-cols-5" : user || cart ? "grid-cols-4" : "grid-cols-3"}`}
    >
      <NavLink href="/" title="الرئيسية">
        <ImHome className="size-6" />
      </NavLink>

      <NavLink title="المنتجات" href="/products/any?search=all">
        <Search className="size-6" />
      </NavLink>

      {cart != null && (
        <NavLink href="/cart" navType="cart">
          <ShoppingBag />
          <small className="absolute -right-1 -top-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-xs font-bold text-white">
            {cart.products.length}
          </small>
        </NavLink>
      )}

      {user && (
        <NavLink href={`/account/${user?.profile?.id}/orders`} title="طلباتي">
          <CiDeliveryTruck className="size-7" />
        </NavLink>
      )}

      <NavLink href="/options" title="الخيارات">
        <SlOptions className="size-7" />
      </NavLink>
    </div>
  );
}

function NavLink({
  href,
  children,
  title,
  navType = "normal",
}: {
  href: string;
  children: ReactNode;
  title?: string;
  navType?: string;
}) {
  const pathname = usePathname();

  return (
    <LoadingLink
      href={href}
      className={`group inline-flex cursor-pointer flex-col items-center justify-center px-5 ${
        (href === pathname ||
          ((href as string).match(/\/products*/) &&
            pathname.match(/\/products*/))) &&
        "bg-slate-300 text-rayanPrimary-dark"
      }`}
    >
      {navType === "cart" ? (
        <div
          className={`relative rounded-xl bg-rayanPrimary-dark p-2 text-slate-100 ${href !== pathname && "bg-opacity-60"}`}
        >
          {children}
        </div>
      ) : (
        children
      )}
      {(href === pathname ||
        ((href as string).match(/\/products*/) &&
          pathname.match(/\/products*/))) && (
        <span className="text-xs">{title}</span>
      )}
    </LoadingLink>
  );
}
