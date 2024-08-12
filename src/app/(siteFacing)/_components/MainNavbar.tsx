"use client";
import Image from "next/image";
import Link from "next/link";
import Logo from "../../rayan.marketLogo.png";
import { usePathname, useRouter } from "next/navigation";
import { ComponentProps, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { ShoppingBag, UserCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import logout from "../auth/_actions/logout";
import SearchProducts from "./SearchProducts";
import { checkProductTypeExists } from "../_actions/checkProductsType";
import { Cart } from "@/app/(siteFacing)/cart/_actions/checkCart";

export default function MainNavbar({
  user,
  cart,
}: {
  user: {
    id: string;
    phone: string;
    username: string;
    role: string;
    profile: { id: string };
  };
  cart: Cart | null;
}) {
  const [offersExists, setOffersExists] = useState(true);
  const [forHomeExists, setForHomeExists] = useState(true);

  const router = useRouter();

  const pathname = usePathname();

  const isAccountPage = pathname === `/account/${user?.profile?.id}`;

  useEffect(() => {
    const checkProductsLinks = async () => {
      const isOffer = await checkProductTypeExists("offers");
      const isForHome = await checkProductTypeExists("forHome");
      setOffersExists(isOffer);
      setForHomeExists(isForHome);
    };
    checkProductsLinks();
  }, []);

  return (
    <nav
      className="mx-auto hidden max-w-[1481.6px] border-gray-200 dark:bg-[#C7E7E2] sm:block"
      dir="rtl"
    >
      <div className="mx-auto flex max-w-screen-xl flex-wrap items-center justify-between p-4">
        <Link
          href="/"
          className="flex items-center space-x-3 rtl:space-x-reverse"
        >
          <Image src={Logo} className="h-[50px] w-[80px]" alt="Al Rayan Logo" />
        </Link>

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
              <li
                className={
                  `${pathname === "/cart" && "group rounded-lg text-base font-normal text-rayanPrimary-dark transition duration-75"}` &&
                  "cursor-pointer"
                }
                onClick={() => router.push("/cart")}
              >
                <ShoppingBag
                  className={`${pathname === "/cart" && "size-6"}`}
                />
              </li>
            )}

            <li className="hover:cursor-pointer">
              <DropdownMenu dir="rtl">
                <DropdownMenuTrigger asChild>
                  <UserCircle />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-50">
                  {!user ? (
                    <>
                      <DropdownMenuCheckboxItem
                        className="hover:cursor-pointer hover:bg-gray-400 hover:text-white"
                        onClick={() => router.push("/auth/register")}
                      >
                        التسجيل
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem
                        className="hover:cursor-pointer hover:bg-gray-400 hover:text-white"
                        onClick={() => router.push("/auth/login")}
                      >
                        تسجيل الدخول
                      </DropdownMenuCheckboxItem>
                    </>
                  ) : (
                    <>
                      {!isAccountPage && (
                        <DropdownMenuCheckboxItem
                          className="hover:cursor-pointer hover:bg-gray-400 hover:text-white"
                          onClick={() => {
                            user?.role === "customer"
                              ? router.push(
                                  `/account/${
                                    user?.profile?.id || "unRegisteredUser"
                                  }`,
                                )
                              : router.push("/admin");
                          }}
                        >
                          {user?.role === "customer"
                            ? "الصفحة الشخصية"
                            : "لوحة التحكم"}
                        </DropdownMenuCheckboxItem>
                      )}
                      <DropdownMenuCheckboxItem
                        className="hover:cursor-pointer hover:bg-gray-400 hover:text-white"
                        onClick={async () => {
                          await logout();
                        }}
                      >
                        تسجيل الخروج
                      </DropdownMenuCheckboxItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

function NavLink(props: Omit<ComponentProps<typeof Link>, "className">) {
  const pathname = usePathname();

  return (
    <Link
      {...props}
      className={cn(
        `group rounded-lg text-base font-normal transition duration-75 ${
          props.href !== "/cart" && "p-2 hover:bg-gray-700 hover:text-white"
        }`,
        props.href !== "/cart" &&
          pathname === props.href &&
          `bg-gray-700 px-6 text-white`,
      )}
    />
  );
}
