"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ComponentProps } from "react";
import { CiDeliveryTruck } from "react-icons/ci";
import { SlOptions } from "react-icons/sl";
import { ImHome } from "react-icons/im";
import { Search, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";

export default function BottomNavLinks({ user }: { user }) {
  return (
    <div className={`mx-auto grid h-full max-w-lg grid-cols-5`}>
      <NavLink href="/">
        <ImHome className="size-7" />
        <span className="text-xs">الرئيسية</span>
      </NavLink>

      <NavLink href="/products?search=all">
        <Search className="size-7" />
        <span className="text-xs">المنتجات</span>
      </NavLink>

      <NavLink href="/cart">
        <ShoppingBag className="size-7" />
        <span className="text-xs">السلة</span>
      </NavLink>

      <NavLink href={`/account/${user?.profile?.id}/orders`}>
        <CiDeliveryTruck className="size-8" />
        <span className="text-xs">طلباتي</span>
      </NavLink>

      <NavLink href="/options">
        <SlOptions className="size-8" />
        <span className="text-xs">الخيارات</span>
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
          `bg-gray-100 text-rayanPrimary-dark ${
            pathname === "/options" && "rounded-e-full"
          } ${pathname === "/" && "rounded-s-full"}`,
      )}
    />
  );
}
