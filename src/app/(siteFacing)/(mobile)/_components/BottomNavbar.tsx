import { CiDeliveryTruck } from "react-icons/ci";
import { SlOptions } from "react-icons/sl";
import BottomNavLink from "./BottomNavLink";
import { ImHome } from "react-icons/im";
import SearchProducts from "@/app/(siteFacing)/_components/SearchProducts";
import db from "@/db/db";
import { addHours } from "date-fns";
import { cache } from "@/lib/cache";
import { ProductCardProps } from "../../products/_components/ProductCard";
import Banner from "../../_components/Banner";

const getProducts = cache(() => {
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
}, ["/", "getProducts"]);

export default async function BottomNavbar() {
  const products = await getProducts();

  return (
    <div className="fixed bottom-4 left-1/2 z-50 h-16 w-full max-w-lg -translate-x-1/2 rounded-full border border-gray-100 bg-rayanPrimary-dark text-white">
      <div className="mx-auto grid h-full max-w-lg grid-cols-4">
        <BottomNavLink
          href="/"
          title="الرئيسية"
          icon={<ImHome className="size-7" />}
        />

        <SearchProducts
          offersBanner={<Banner type="offers" />}
          forHomeBanner={<Banner type="forHome" />}
          className="group inline-flex flex-col items-center justify-center px-5"
          allProducts={products as ProductCardProps[]}
        />

        <BottomNavLink
          href="/orders"
          icon={<CiDeliveryTruck className="size-8" />}
          title="طلباتي"
        />

        <BottomNavLink
          href="/options"
          icon={<SlOptions className="size-8" />}
          title="الخيارات"
        />
      </div>
    </div>
  );
}
