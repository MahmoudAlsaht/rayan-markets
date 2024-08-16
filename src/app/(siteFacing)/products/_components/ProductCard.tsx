"use client";
import { formatCurrency } from "@/lib/formatters";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Minus, Plus, ShoppingBag } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { updateProductViews } from "../../_actions/product";
import { CartProduct, findProduct } from "../../cart/_actions/checkCart";
import {
  addProductToCart,
  addToProductCounter,
  takeFromProductCounter,
} from "../../cart/_actions/cartActions";
import { LoadingLink } from "@/context/LoadingContext";

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

export default function ProductCard({
  product,
  isProductDetailsPage = false,
  handleCloseSearch,
}: {
  product: ProductCardProps;
  isProductDetailsPage?: boolean;
  handleCloseSearch?: () => void;
}) {
  const router = useRouter();
  const [_, startTransition] = useTransition();
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

  const pathname = usePathname();
  const [productInCart, setProductInCart] = useState<CartProduct | null>(null);
  const [isProductInCart, setIsProductInCart] = useState(false);

  const showPage = async (id: string) => {
    if (!isProductDetailsPage) {
      router.push(`/products/any/${id}`);
      updateProductViews(id);
      handleCloseSearch && handleCloseSearch();
    }
  };

  const handleAddToCart = (selectedWeight?: number) => {
    startTransition(async () => {
      const newProduct = await addProductToCart({ ...product, selectedWeight });
      setProductInCart(newProduct);
      setIsProductInCart(newProduct !== null);
    });
  };

  const handleAddToCounter = () => {
    startTransition(async () => {
      const updatedProduct = await addToProductCounter(id as string);
      setProductInCart(updatedProduct);
      setIsProductInCart(updatedProduct !== null);
    });
  };

  const handleTakeFromCounter = () => {
    startTransition(async () => {
      const updatedProduct = await takeFromProductCounter(id as string);
      setProductInCart(updatedProduct);
      setIsProductInCart(updatedProduct !== null);
    });
  };

  useEffect(() => {
    const checkProduct = async () => {
      const product = await findProduct(id as string);
      setProductInCart(product);
      setIsProductInCart(product !== null);
    };
    checkProduct();
  }, [id, pathname]);

  return (
    <div
      dir="rtl"
      className={`bg-inherit ${
        isProductDetailsPage
          ? "h-screen pr-2 pt-10 md:flex md:gap-2 lg:gap-16 lg:pr-10"
          : "cursor-pointer rounded-xl border-x-2 border-b-2 border-slate-300 shadow-md shadow-slate-200 duration-500 sm:hover:scale-105 sm:hover:shadow-xl"
      } `}
    >
      <div
        className={`relative ${
          isProductDetailsPage
            ? "mx-auto h-72 w-10/12 sm:h-96 sm:w-3/5 md:w-2/5"
            : "h-44"
        } `}
      >
        <LoadingLink
          href={() => showPage(product.id as string)}
          className="relative h-full w-full"
        >
          <Image
            fill
            priority
            className={`rounded-t-xl object-cover duration-500 sm:hover:scale-105 sm:hover:shadow-xl ${isProductDetailsPage && "rounded-3xl"} `}
            src={image?.path as string}
            alt={`${name || "product"}'s image`}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </LoadingLink>
        <div
          className={`absolute -bottom-6 rounded-2xl bg-white py-2 shadow-sm duration-500 ${isProductDetailsPage ? (isProductInCart ? "right-0 w-full" : "right-1/4 w-1/2") : "-bottom-4 left-2 w-full rounded-2xl bg-white py-2 shadow-md shadow-slate-200 sm:left-0 sm:scale-95 sm:hover:scale-100 sm:hover:shadow-xl" && isProductInCart && "w-full"}`}
        >
          {!isProductInCart && (
            <ProductMenuPrice
              weights={weights && weights.length ? weights : null}
              handleAddToCart={handleAddToCart}
            />
          )}
          {isProductInCart && (
            <div className="flex items-center justify-around">
              <Button
                size="sm"
                variant="secondary"
                onClick={handleAddToCounter}
              >
                <Plus className="size-6 text-rayanPrimary-dark" />
              </Button>
              <span className="text-rayanPrimary-dark">
                {productInCart?.counter || 0}
              </span>
              <Button
                size="sm"
                variant="secondary"
                onClick={handleTakeFromCounter}
              >
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

      <LoadingLink
        className={`w-full ${isProductDetailsPage ? "mt-10 flex flex-col items-center py-0 md:mt-8 md:w-1/2 md:items-start" : "mt-2 py-3 sm:px-4"} `}
        href={() => showPage(product.id as string)}
      >
        <p
          className={`${isProductDetailsPage ? "text-2xl font-bold capitalize text-rayanPrimary-dark sm:text-3xl" : "text-md mt-2 block truncate text-center font-bold capitalize text-rayanPrimary-dark sm:text-start sm:text-lg"} `}
        >
          {isProductDetailsPage ? body : name}
        </p>
        <div className={`mt-4 flex items-center justify-center gap-6`}>
          <div
            className={`flex items-center justify-around sm:gap-2 md:justify-start`}
          >
            <p
              className={`sm:text-md my-3 cursor-auto font-semibold text-rayanSecondary-dark ${isProductDetailsPage ? "text-xl sm:text-3xl" : "text-sm"}`}
            >
              {formatCurrency(newPrice ? newPrice : (price as number))}
            </p>
          </div>
          {newPrice && (
            <del>
              <p
                className={`cursor-auto text-gray-600 line-through ${isProductDetailsPage ? "text-xl sm:text-2xl" : "sm:text-md text-sm"}`}
              >
                {formatCurrency(price as number)}
              </p>
            </del>
          )}
        </div>
        {isProductDetailsPage && (
          <div className="mt-6 text-xl sm:text-2xl md:text-3xl">
            {description}
          </div>
        )}
      </LoadingLink>
      {isProductDetailsPage && <div className="h-24"></div>}
    </div>
  );
}

function ProductMenuPrice({
  weights,
  handleAddToCart,
}: {
  weights?: number[] | null;
  handleAddToCart: (weight?: number) => void;
}) {
  const addProduct = () => handleAddToCart();

  if (!weights)
    return (
      <ShoppingBag
        className={`size-6 w-full cursor-pointer px-10`}
        onClick={addProduct}
      />
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
          <DropdownMenuItem key={index} onClick={() => handleAddToCart(price)}>
            {price} كيلو
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function ProductCardSkeleton({
  isProductDetailsPage = false,
}: {
  isProductDetailsPage?: boolean;
}) {
  return isProductDetailsPage ? (
    <div className="flex flex-col gap-10 md:flex-row md:gap-16">
      <div className="mx-auto mt-6 h-96 w-9/12 animate-pulse rounded-3xl bg-gray-400 object-cover pt-10 md:mx-0 md:mr-24 md:h-4/6 md:w-5/12" />

      <div className="flex w-full animate-pulse flex-col items-center gap-6 md:mt-16 md:w-3/4 md:items-start">
        <Button disabled className="h-4 w-6/12"></Button>
        <Button disabled className="h-4 w-6/12"></Button>
        <Button disabled className="h-4 w-6/12"></Button>
      </div>
    </div>
  ) : (
    <div className="h-80 animate-pulse cursor-pointer rounded-xl border-x-2 border-b-2 border-slate-300 bg-gray-400 shadow-md shadow-slate-200" />
  );
}
