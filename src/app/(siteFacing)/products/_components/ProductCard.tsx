"use client";
import { formatCurrency } from "@/lib/formatters";
import Image from "next/image";
import { LoadingLink } from "@/app/(siteFacing)/_context/LoadingContext";
import { ProductCardProps } from "../[productsType]/[id]/page";
import HandleCartActions from "./HandleCartActions";
import { useProductCart } from "@/app/(siteFacing)/_context/ProductCartContext";
import { updateProductViews } from "../../_actions/product";
import { useRouter } from "next/navigation";

export default function ProductCard({
  product,
}: {
  product: ProductCardProps;
}) {
  const { productCart } = useProductCart();
  const router = useRouter();

  const handleUpdateViews = async () => {
    await updateProductViews(product.id as string);
    router.push(`/products/any/${product.id}`);
  };

  return (
    <>
      <div
        dir="rtl"
        className={`cursor-pointer rounded-xl border-x-2 border-b-2 border-slate-300 bg-inherit shadow-md shadow-slate-200 duration-500 sm:hover:scale-105 sm:hover:shadow-xl ${(product.quantity < 1 || (productCart && (productCart?.limit || 0) < 1)) && "opacity-20"}`}
      >
        <div className="relative h-44">
          <LoadingLink
            href={handleUpdateViews}
            className="relative h-full w-full"
          >
            <Image
              fill
              priority
              className="rounded-t-xl object-cover duration-500 sm:hover:scale-105 sm:hover:shadow-xl"
              src={product?.image?.path as string}
              alt={`${product?.name || "product"}'s image`}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </LoadingLink>
          <div
            className={`absolute -bottom-6 rounded-lg bg-slate-100 py-2 duration-500 sm:left-0 ${productCart ? "right-0 w-full" : "right-1/4 w-1/2"} ${(product.quantity < 1 || (productCart && (productCart?.limit || 0) < 1)) && "bg-slate-400 text-transparent"}`}
          >
            <HandleCartActions product={product} />
          </div>
          {product?.isOffer && (
            <div className="absolute right-0 top-0 rounded-2xl bg-destructive px-4 py-0 text-white">
              خصم
            </div>
          )}
        </div>

        <LoadingLink
          className="mt-3 w-full py-3 sm:px-4"
          href={handleUpdateViews}
        >
          <p className="text-md block truncate text-center font-bold capitalize text-rayanPrimary-dark sm:text-start sm:text-lg">
            {product?.name}
          </p>
          <div className="mt-4 flex items-center justify-center gap-6">
            <div className="flex items-center justify-around sm:gap-2 md:justify-start">
              <p className="sm:text-md my-3 cursor-auto text-sm font-semibold text-rayanSecondary-dark">
                {formatCurrency(
                  product?.newPrice
                    ? product?.newPrice
                    : (product?.price as number),
                )}
              </p>
            </div>
            {product?.newPrice && (
              <del>
                <p className="sm:text-md cursor-auto text-sm text-gray-600 line-through">
                  {formatCurrency(product?.price as number)}
                </p>
              </del>
            )}
          </div>
        </LoadingLink>
      </div>
    </>
  );
}
