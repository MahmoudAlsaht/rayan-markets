import db from "@/db/db";
import BackButtonNav from "@/components/BackButtonNav";
import { ProductCard, ProductCardProps } from "../_components/ProductCard";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { checkUser } from "../../auth/_actions/isAuthenticated";

export default async function ProductsTypePage({
  params: { id },
}: {
  params: { id: string };
}) {
  const user = await checkUser();
  const product = await db.product.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      description: true,
      body: true,
      price: true,
      newPrice: true,
      productType: true,
      weights: true,
      isOffer: true,
      image: {
        select: {
          path: true,
        },
      },
    },
  });
  return (
    <>
      <div className="sm:hidden">
        <BackButtonNav />
      </div>
      <div className="hidden sm:block">
        <BackButtonNav bg={false} />
      </div>
      {user && (user.role === "admin" || user.role === "editor") && (
        <Button className="w-full">
          <Link href={`/admin/settings/products/${product?.id as string}`}>
            تعديل المنتج
          </Link>
        </Button>
      )}
      <div className="container h-screen w-full p-0">
        <ProductCard
          product={product as ProductCardProps}
          isProductDetailsPage
        />
      </div>
    </>
  );
}
