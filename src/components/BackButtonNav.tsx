"use client";
import { ArrowRight } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "./ui/button";

export default function BackButtonNav({
  goHome,
  href = "",
}: {
  goHome?: boolean;
  href?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const isOptionsPage = pathname === "/options";
  const isProductsPage =
    pathname.includes("/products") && !pathname.includes("/admin");

  return (
    <>
      <nav
        className={`pb-2 ${isOptionsPage || isProductsPage ? "bg-rayanPrimary-dark" : "bg-inherit"}`}
      >
        <div className="mx-auto flex h-14 max-w-screen-xl flex-wrap items-center justify-between p-4">
          <Button
            data-collapse-toggle="navbar-default"
            type="button"
            variant="outline"
            className={`${
              isOptionsPage || isProductsPage
                ? "border-none bg-inherit text-white hover:bg-inherit"
                : "bg-inherit text-rayanPrimary-dark"
            } inline-flex h-10 w-10 items-center justify-center rounded-lg p-2 text-sm`}
            aria-controls="navbar-default"
            aria-expanded="false"
            onClick={() =>
              !goHome
                ? href === ""
                  ? router.back()
                  : router.replace(href)
                : router.replace("/")
            }
          >
            <span className="sr-only">Go Back One Page</span>
            <ArrowRight />
          </Button>
        </div>
      </nav>
    </>
  );
}
