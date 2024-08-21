"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function CheckoutNav() {
  const pathname = usePathname();

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <Link
            href={`${pathname !== "/checkout/contact" ? "/checkout/contact" : "#"}`}
            className={`cursor-pointer ${pathname === "/checkout/contact" && "hover:text-none cursor-text text-rayanPrimary-dark"}`}
          >
            معلومات التواصل
          </Link>
        </BreadcrumbItem>

        {(pathname === "/checkout/payment-method" ||
          pathname === "/checkout/order-details") && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <Link
                className={`cursor-pointer ${pathname === "/checkout/payment-method" && "hover:text-none cursor-text text-rayanPrimary-dark"}`}
                href={`${pathname !== "/checkout/payment-method" ? "/checkout/payment-method" : "#"}`}
              >
                طرق الدفع
              </Link>
            </BreadcrumbItem>
          </>
        )}

        {pathname === "/checkout/order-details" && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <Link
                className={`cursor-pointer ${pathname === "/checkout/order-details" && "hover:text-none cursor-text text-rayanPrimary-dark"}`}
                href={`${pathname !== "/checkout/order-details" ? "/checkout/order-details" : "#"}`}
              >
                الطلب
              </Link>
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
