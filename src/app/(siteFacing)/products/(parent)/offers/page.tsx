import Banner from "@/app/(siteFacing)/_components/Banner";
import db from "@/db/db";
import { cache } from "@/lib/cache";
import { addHours } from "date-fns";
import ProductsContainer from "../../_components/ProductsContainer";
import { ProductCardProps } from "../../_components/ProductCard";

const getOffers = cache(() => {
  db.product.updateMany({
    where: {
      offerEndsAt: {
        lt: addHours(new Date(), 3),
      },
    },
    data: {
      newPrice: null,
      isOffer: false,
      offerStartsAt: null,
      offerEndsAt: null,
    },
  });

  db.product.updateMany({
    where: {
      offerStartsAt: {
        gt: addHours(new Date(), 3),
      },
    },
    data: {
      isOffer: false,
    },
  });

  db.product.updateMany({
    where: {
      AND: [
        {
          offerStartsAt: {
            lte: addHours(new Date(), 3),
          },
        },
        {
          offerEndsAt: {
            gt: addHours(new Date(), 3),
          },
        },
      ],
    },
    data: {
      isOffer: true,
    },
  });

  return db.product.findMany({
    where: { isOffer: true },
    select: {
      id: true,
      name: true,
      price: true,
      newPrice: true,
      weights: true,
      isOffer: true,
      productType: true,
      image: {
        select: {
          path: true,
        },
      },
    },
  });
}, ["/products/offers", "getOffers"]);

export default async function OffersPage() {
  const offers = await getOffers();

  return (
    <div dir="rtl" className="h-screen">
      <Banner type="offers" />

      <ProductsContainer products={offers as ProductCardProps[]} />
      <div className="h-20"></div>
    </div>
  );
}
