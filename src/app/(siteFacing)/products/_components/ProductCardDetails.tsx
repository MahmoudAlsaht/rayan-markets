import { formatCurrency } from "@/lib/formatters";
import Image from "next/image";
import { ProductCardProps } from "../[productsType]/[id]/page";
import HandleCartActions from "./HandleCartActions";
import { findProduct } from "../../cart/_actions/checkCart";

export default async function ProductCardDetails({
  product,
}: {
  product: ProductCardProps;
}) {
  const productInCart = await findProduct(product.id as string);
  return (
    <>
      {product.quantity < 6 && product.quantity > 0 ? (
        <div className="mt-4 text-center text-3xl text-rayanWarning-dark">
          <h3>اقتربت الكمية من النفاد</h3>
        </div>
      ) : (
        product.quantity < 1 && (
          <div className="mt-4 text-center text-3xl text-rayanWarning-dark">
            <h3>هذا المنتج غير متوفر في الوقت الحالي</h3>
          </div>
        )
      )}
      <div dir="rtl" className="mt-4 w-full bg-inherit md:flex">
        <div className="relative mx-auto h-72 w-11/12 sm:h-96 sm:w-3/5 md:w-2/5">
          <div className="relative h-full w-full">
            <Image
              fill
              priority
              className="rounded-3xl rounded-t-xl object-cover duration-500 sm:hover:scale-105 sm:hover:shadow-xl"
              src={product?.image?.path as string}
              alt={`${product?.name || "product"}'s image`}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          <div
            className={`absolute rounded-lg bg-slate-100 py-3 transition-all duration-500 sm:left-0 ${productInCart ? "-bottom-7 right-4 w-11/12" : "-bottom-6 right-1/4 w-1/2"}`}
          >
            <HandleCartActions
              productInCart={productInCart}
              product={product}
            />
          </div>
          {product?.isOffer && (
            <div className="absolute right-0 top-0 rounded-2xl bg-destructive px-4 py-0 text-white">
              خصم
            </div>
          )}
        </div>

        <div className="mt-10 flex w-full flex-col items-center py-0 md:mt-8 md:w-1/2 md:items-start">
          <p className="text-2xl font-bold capitalize text-rayanPrimary-dark sm:text-3xl">
            {product?.body}
          </p>
          {productInCart && productInCart.limit < 1 && (
            <p className="mt-6 text-xl text-rayanWarning-dark">
              لا يمكنك اضافة المزيد من هذا المنتج{" "}
            </p>
          )}
          <div className="mt-4 flex items-center justify-center gap-6">
            <div className="flex items-center justify-around sm:gap-2 md:justify-start">
              <p className="sm:text-md my-3 cursor-auto text-xl font-semibold text-rayanSecondary-dark sm:text-3xl">
                {formatCurrency(
                  product?.newPrice
                    ? product?.newPrice
                    : (product?.price as number),
                )}
              </p>
            </div>
            {product?.newPrice && (
              <del>
                <p className="cursor-auto text-xl text-gray-600 line-through sm:text-2xl">
                  {formatCurrency(product?.price as number)}
                </p>
              </del>
            )}
          </div>
          <div className="mt-6 text-xl sm:text-2xl md:text-3xl">
            {product?.description}
          </div>
        </div>
      </div>
    </>
  );
}
