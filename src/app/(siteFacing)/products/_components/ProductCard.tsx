"use client";
import { formatCurrency } from "@/lib/formatters";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Minus, Plus, ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useStartLoading } from "@/context/LoadingContext";
import { updateProductViews } from "../../_actions/product";
import { CartProduct, useCart } from "@/context/cart/CartContext";

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
  const { getProduct, addProduct, toggleProductCounter } = useCart();

  const {
    id,
    image,
    name,
    price,
    newPrice,
    description,
    productType,
    body,
    weights,
    isOffer,
  } = product;

  const { startLoading } = useStartLoading();
  const [productInCart, setProductInCart] = useState<CartProduct | null>(null);
  const [isProductInCart, setIsProductInCart] = useState(false);

  const showPage = (id: string) => {
    if (!isProductDetailsPage) {
      router.push(`/products/any/${id}`);
      startLoading(updateProductViews(id));
      handleCloseSearch && handleCloseSearch();
    }
  };

  const handleAddToCart = async (selectedWeight?: number) => {
    const newProduct = await addProduct({ ...product, selectedWeight });
    setIsProductInCart(productInCart !== null);
  };

  const handleAddToCounter = async () => {
    const updatedProduct = await toggleProductCounter(id as string, "add");
    setProductInCart(updatedProduct);
    setIsProductInCart(updatedProduct !== null);
  };

  const handleTakeFromCounter = async () => {
    const updatedProduct = await toggleProductCounter(id as string, "take");
    setProductInCart(updatedProduct);
    setIsProductInCart(updatedProduct !== null);
  };

  useEffect(() => {
    const checkProduct = async () => {
      const product = await getProduct(id as string);
      setProductInCart(product);
      setIsProductInCart(product !== null);
    };
    checkProduct();
  }, [getProduct, id]);

  return (
    <div
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
        <Image
          fill
          priority
          className={`rounded-t-xl object-cover duration-500 sm:hover:scale-105 sm:hover:shadow-xl ${isProductDetailsPage && "rounded-3xl"} `}
          src={image?.path as string}
          alt={`${name || "product"}'s image`}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          onClick={() => showPage(product.id as string)}
        />
        <div
          className={`absolute duration-500 ${isProductDetailsPage ? `${`-bottom-6 ${isProductInCart ? "right-0 w-full pr-6 sm:pr-0 md:right-1/4 md:w-1/2" : "right-1/4 w-1/2"} shadow-sm`} rounded-2xl bg-white px-2 py-2` : `-bottom-4 rounded-2xl bg-white px-2 py-2 shadow-md shadow-slate-200 sm:scale-95 sm:hover:scale-100 sm:hover:shadow-xl ${isProductInCart && "w-11/12 pl-0 sm:w-full"} left-2 sm:left-0`} `}
        >
          {!isProductInCart && (
            <ProductMenuPrice
              weights={weights && weights.length ? weights : null}
              handleAddToCart={handleAddToCart}
            />
          )}
          {isProductInCart && (
            <div className="flex w-11/12 items-center justify-between sm:px-6 sm:pl-4">
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

      <div
        className={`w-full ${isProductDetailsPage ? "mt-10 flex flex-col items-center py-0 md:mt-8 md:w-1/2 md:items-start" : "mt-2 py-3 sm:px-4"} `}
        onClick={() => !isProductDetailsPage && showPage(product.id as string)}
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
      </div>
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
      <ShoppingBag className={`size-6 w-full px-10`} onClick={addProduct} />
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
