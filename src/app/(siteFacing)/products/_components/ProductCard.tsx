"use client";
import { formatCurrency } from "@/lib/formatters";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Minus, Plus, ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { updateProductViews } from "../../_actions/product";

export type ProductCardProps = {
  id: string | null;
  image: {
    path: string;
  } | null;
  name: string | null;
  price: number | null;
  newPrice: number | null;
  productType: string;
  description?: string | null;
  body?: string | null;
  weights: number[] | null;
  isOffer: boolean | null;
};
export function ProductCard({
  product,
  isProductDetailsPage = false,
  handleSearchClose,
}: {
  product: ProductCardProps;
  isProductDetailsPage?: boolean;
  handleSearchClose?: () => void;
}) {
  const router = useRouter();

  const {
    id,
    image,
    name,
    price,
    newPrice,
    description,
    body,
    weights,
    isOffer,
  } = product;

  const [addingToCart, setAddingToCart] = useState(false);
  const [_pending, startTransition] = useTransition();

  const handleAddView = () => {
    startTransition(async () => {
      await updateProductViews(product?.id as string);
    });
  };

  const showPage = () => {
    if (!isProductDetailsPage) {
      router.push(`/products/${id}`);
      handleSearchClose && handleSearchClose();
      handleAddView();
      return;
    }
    router.push(`/products/${id}`);
    handleAddView();
  };
  return isProductDetailsPage ? (
    <div className="h-screen bg-inherit pr-2 pt-10 md:flex md:gap-2 lg:gap-16 lg:pr-10">
      <div className="relative mx-auto h-72 w-10/12 sm:h-96 sm:w-3/5 md:w-2/5">
        <Image
          fill
          priority
          className="rounded-3xl"
          src={image?.path as string}
          alt={`${name || "product"}'s image`}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          onClick={showPage}
        />
        <div
          className={`absolute ${`-bottom-6 ${addingToCart ? "right-0 w-full pr-6 sm:pr-0 md:right-1/4 md:w-1/2" : "right-1/4 w-1/2"} shadow-sm`} rounded-2xl bg-white px-2 py-2`}
        >
          {!addingToCart && (
            <ProductMenuPrice
              weights={weights && weights.length ? weights : null}
              handleClick={() => setAddingToCart(true)}
            />
          )}
          {addingToCart && (
            <div className="flex w-11/12 items-center justify-between px-4 sm:px-6 sm:pl-4">
              <Button size="sm" variant="secondary">
                <Plus className="size-6 text-rayanPrimary-dark" />
              </Button>
              <span>0</span>
              <Button size="sm" variant="secondary">
                <Minus className="size-6 text-rayanPrimary-dark" />
              </Button>
            </div>
          )}
        </div>
        {isOffer && (
          <div className="absolute right-0 top-0 rounded-2xl bg-destructive px-8 py-2 text-white">
            خصم
          </div>
        )}
      </div>

      <div
        className="mt-10 flex w-full flex-col items-center py-0 md:mt-8 md:w-1/2 md:items-start"
        onClick={showPage}
      >
        <p
          className={`text-2xl font-bold capitalize text-rayanPrimary-dark sm:text-3xl`}
        >
          {isProductDetailsPage ? body : name}
        </p>
        <div className="mt-4 flex items-center justify-center gap-6">
          <p className="sm:text-md my-3 cursor-auto text-xl font-semibold text-rayanSecondary-dark sm:text-3xl">
            {formatCurrency(newPrice ? newPrice : (price as number))}
          </p>
          {newPrice && (
            <del>
              <p className="sm:text-md cursor-auto text-xl text-gray-600 line-through sm:text-2xl">
                {formatCurrency(price as number)}
              </p>
            </del>
          )}
        </div>
        <div className="mt-6 text-xl sm:text-2xl md:text-3xl">
          {description}
        </div>
      </div>
      <div className="h-24"></div>
    </div>
  ) : (
    <div
      className={`cursor-pointer rounded-xl border-x-2 border-b-2 border-slate-300 bg-inherit shadow-md shadow-slate-200 duration-500 sm:hover:scale-105 sm:hover:shadow-xl`}
    >
      <div className={`relative h-44`}>
        <Image
          fill
          priority
          className={`rounded-t-xl object-cover duration-500 sm:hover:scale-105 sm:hover:shadow-xl`}
          src={image?.path as string}
          alt={`${name || "product"}'s image`}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          onClick={showPage}
        />
        <div
          className={`absolute -bottom-4 rounded-2xl bg-white px-2 py-2 shadow-md shadow-slate-200 duration-500 sm:scale-95 sm:hover:scale-100 sm:hover:shadow-xl ${addingToCart && "w-11/12 sm:w-full"} left-2 sm:left-0`}
        >
          {!addingToCart && (
            <ProductMenuPrice
              weights={weights && weights.length ? weights : null}
              handleClick={() => setAddingToCart(true)}
            />
          )}
          {addingToCart && (
            <div className="flex w-11/12 items-center justify-between px-4 sm:px-6 sm:pl-4">
              <Button size="sm" variant="secondary">
                <Plus className="size-6 text-rayanPrimary-dark" />
              </Button>
              <span>0</span>
              <Button size="sm" variant="secondary">
                <Minus className="size-6 text-rayanPrimary-dark" />
              </Button>
            </div>
          )}
        </div>
        {isOffer && (
          <div
            className={`absolute right-0 top-0 rounded-2xl bg-destructive px-4 py-0 text-white`}
          >
            خصم
          </div>
        )}
      </div>

      <div className={`mt-2 w-full py-3 sm:px-4`} onClick={showPage}>
        <p
          className={`text-md mt-2 block truncate text-center font-bold capitalize text-rayanPrimary-dark sm:text-start sm:text-lg`}
        >
          {name}
        </p>
        <div className={`mt-4 flex items-center justify-center gap-6`}>
          <div
            className={`flex items-center justify-around sm:gap-2 md:justify-start`}
          >
            <p
              className={`sm:text-md my-3 cursor-auto text-sm font-semibold text-rayanSecondary-dark`}
            >
              {formatCurrency(newPrice ? newPrice : (price as number))}
            </p>
          </div>
          {newPrice && (
            <del>
              <p
                className={`sm:text-md cursor-auto text-sm text-gray-600 line-through`}
              >
                {formatCurrency(price as number)}
              </p>
            </del>
          )}
        </div>
      </div>
    </div>
  );
}

function ProductMenuPrice({
  weights,
  handleClick,
}: {
  weights?: number[] | null;
  handleClick?: () => void;
}) {
  if (!weights)
    return (
      <ShoppingBag className={`size-6 w-full px-10`} onClick={handleClick} />
    );

  return (
    <DropdownMenu dir="rtl">
      <DropdownMenuTrigger asChild>
        <ShoppingBag className="size-6 w-full px-10" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>اختر الوزن</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {weights.map((price, index) => (
          <DropdownMenuItem key={index} onClick={handleClick}>
            {price} كيلو
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
