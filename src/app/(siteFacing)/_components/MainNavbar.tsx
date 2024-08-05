"use client";
import Image from "next/image";
import Link from "next/link";
import Logo from "../../rayan.marketLogo.png";
import { usePathname, useRouter } from "next/navigation";
import { ComponentProps, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { UserCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User } from "@prisma/client";
import logout from "../auth/_actions/logout";
import SearchProducts from "./SearchProducts";
import { checkProductTypeExists } from "../_actions/checkProductsType";

export default function MainNavbar({ user }: { user: Partial<User> | null }) {
  const [offersExists, setOffersExists] = useState(false);
  const [forHomeExists, setForHomeExists] = useState(false);

  const router = useRouter();

  const pathname = usePathname();

  const isAccountPage = pathname === `/account/${user?.profileId}`;

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
              <NavLink href="/products">المنتجات</NavLink>
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
                            user.role === "customer"
                              ? router.push(
                                  `/account/${
                                    user.profileId || "unRegisteredUser"
                                  }`,
                                )
                              : router.push("/admin");
                          }}
                        >
                          {user.role === "customer"
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
        "group rounded-lg p-2 text-base font-normal transition duration-75 hover:bg-gray-700 hover:text-white",
        pathname === props.href && "bg-gray-700 px-6 text-white",
      )}
    />
  );
}
