import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ShoppingBag } from "lucide-react";

export default function ProductMenuPrice({
  weights,
  flavors,
  disabled = false,
  handleAddToCart,
}: {
  disabled?: boolean;
  weights?: number[] | null;
  flavors?: string[] | null;
  handleAddToCart: (weight?: number | string) => void;
}) {
  const addProduct = () => handleAddToCart();

  if (!weights && !flavors)
    return (
      <ShoppingBag
        className="size-6 w-full cursor-pointer"
        onClick={!disabled ? addProduct : () => null}
      />
    );

  return (
    <DropdownMenu dir="rtl">
      <DropdownMenuTrigger asChild disabled={disabled}>
        <ShoppingBag className="size-6 w-full cursor-pointer" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuSeparator />
        {weights?.map((price, index) => (
          <DropdownMenuItem key={index} onClick={() => handleAddToCart(price)}>
            {price} كيلو
          </DropdownMenuItem>
        ))}
        {flavors?.map((flavor, index) => (
          <DropdownMenuItem key={index} onClick={() => handleAddToCart(flavor)}>
            {flavor}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
