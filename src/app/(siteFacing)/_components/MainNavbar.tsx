"use client";
import Image from "next/image";
import Logo from "../../rayan.marketLogo.png";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { ShoppingBag, UserCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import logout from "../auth/_actions/logout";
import SearchProducts from "./SearchProducts";
import { Cart } from "@/app/(siteFacing)/cart/_actions/checkCart";
import { LoadingLink } from "@/context/LoadingContext";

export default function MainNavbar({
  user,
  cart,
  offersExists = false,
  forHomeExists = false,
}: {
  user: {
    id: string;
    phone: string;
    username: string;
    role: string;
    profile: { id: string };
  };
  cart: Cart | null;
  offersExists?: boolean;
  forHomeExists?: boolean;
}) {
  const pathname = usePathname();

  const isAccountPage = pathname === `/account/${user?.profile?.id}`;

  const menuList: { href: string | (() => void); title: string }[] = !user
    ? [
        {
          href: "/auth/register",
          title: "التسجيل",
        },
        {
          href: "/auth/login",
          title: "تسجيل الدخول",
        },
      ]
    : !isAccountPage
      ? [
          {
            href:
              user?.role === "customer"
                ? `/account/${user?.profile?.id || "unRegisteredUser"}`
                : "/admin",
            title: user?.role === "customer" ? "الصفحة الشخصية" : "لوحة التحكم",
          },
          {
            href: logout,
            title: "تسجيل الخروج",
          },
        ]
      : [
          {
            href: logout,
            title: "تسجيل الخروج",
          },
        ];

  return (
    <>
      <nav
        className="relative top-auto z-50 mx-auto max-w-[1481.6px] border-gray-200 dark:bg-[#C7E7E2]"
        dir="rtl"
      >
        <div className="mx-auto flex max-w-screen-xl flex-wrap items-center justify-between p-4">
          <LoadingLink
            href="/"
            className="flex items-center space-x-3 rtl:space-x-reverse"
          >
            <Image
              src={Logo}
              className="h-[50px] w-[80px]"
              alt="Al Rayan Logo"
            />
          </LoadingLink>

          <div id="navbar-default">
            <ul className="mt-4 flex flex-row rounded-lg p-4 font-medium text-rayanSecondary-dark sm:space-x-8 md:p-0 rtl:space-x-reverse">
              <li>
                <NavLink href="/">الرئيسية</NavLink>
              </li>
              <li>
                <NavLink href="/products/any">المنتجات</NavLink>
              </li>
              {offersExists && (
                <li>
                  <NavLink href="/products/offers">العروض</NavLink>
                </li>
              )}
              {forHomeExists && (
                <li>
                  <NavLink href="/products/for-home">المنزلية</NavLink>
                </li>
              )}

              <li className="hover:cursor-pointer">
                <SearchProducts />
              </li>

              {cart != null && (
                <LoadingLink href="/cart" className="relative">
                  <li
                    className={
                      `${pathname === "/cart" && "group rounded-lg text-base font-normal text-rayanPrimary-dark transition duration-75"}` &&
                      "cursor-pointer"
                    }
                  >
                    <ShoppingBag
                      className={`${pathname === "/cart" && "size-6"}`}
                    />
                  </li>
                  <small className="absolute -top-2 end-3 inline-flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-xs font-bold text-white">
                    {cart.products.length}
                  </small>
                </LoadingLink>
              )}

              <li className="hover:cursor-pointer">
                <DropdownMenu dir="rtl">
                  <DropdownMenuTrigger asChild>
                    <UserCircle />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-50">
                    {menuList.map((item, index) => (
                      <DropdownMenuItem key={index}>
                        <LoadingLink href={item.href}>{item.title}</LoadingLink>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}

function NavLink({ href, children }: { href: string; children: ReactNode }) {
  const pathname = usePathname();

  return (
    <LoadingLink
      href={href}
      className={cn(
        `group rounded-lg text-base font-normal transition duration-75 ${
          href !== "/cart" && "p-2 hover:bg-gray-700 hover:text-white"
        }`,
        href !== "/cart" && pathname === href && `bg-gray-700 px-6 text-white`,
      )}
    >
      {children}
    </LoadingLink>
  );
}
