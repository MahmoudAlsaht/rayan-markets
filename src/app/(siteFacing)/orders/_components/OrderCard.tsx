"use client";
import { LoadingLink } from "@/context/LoadingContext";
import {
  Anonymous,
  Contact,
  District,
  Order,
  OrderProduct,
  Profile,
  PromoCode,
} from "@prisma/client";
import { statuses } from "./OrdersTabs";
import {
  format,
  differenceInMinutes,
  differenceInHours,
  differenceInDays,
} from "date-fns";

export type OrderCardProp = {
  id: string;
  billTotal: number;
  orderId: string;
  status: string;
  paymentMethod: string;
  orderTotal: number;
  createdAt: Date;
  promoCode: Partial<PromoCode>;
  profile: Partial<Profile>;
  anonymous: Partial<Anonymous>;
  products: Partial<OrderProduct>[];
  contact: Partial<Contact> & { district: Partial<District> };
};

export function OrderCard({
  order,
  isOrderDetailsPage = false,
}: {
  order: OrderCardProp;
  isOrderDetailsPage?: boolean;
}) {
  const now = new Date();
  const formattedDate = format(order.createdAt, "yyyy/MM/dd");
  const minutesPassed = differenceInMinutes(now, order.createdAt);
  const hoursPassed = differenceInHours(now, order.createdAt);
  const daysPassed = differenceInDays(now, order.createdAt);

  return !isOrderDetailsPage ? (
    <LoadingLink
      href={`/orders/${order.status}/${order.id}`}
      className="cursor-pointer rounded-2xl bg-white p-4 duration-500 hover:scale-105"
    >
      <div className="flex flex-col justify-center gap-2 p-2">
        <h3>
          <span className="text-rayanSecondary-dark">رقم الطلب:</span>{" "}
          {order.orderId}
        </h3>
        {statuses.map(
          (status) =>
            status.value === order.status && (
              <h3
                className={`${status.color}`}
                key={`${order.id} - ${order.status}`}
              >
                <span className="text-rayanSecondary-dark">الحالة:</span>{" "}
                {status.displayName}
              </h3>
            ),
        )}
        <h3>
          <span className="text-rayanSecondary-dark">منذ: </span>{" "}
          {minutesPassed >= 60
            ? hoursPassed >= 24
              ? daysPassed >= 30
                ? formattedDate
                : `${daysPassed} يوم`
              : `${hoursPassed} ساعة`
            : minutesPassed < 1
              ? "منذ أقل من دقيقة"
              : minutesPassed === 1
                ? "منذ دقيقة"
                : minutesPassed === 2
                  ? "منذ دقيقتين"
                  : minutesPassed > 2 && minutesPassed < 11
                    ? `${minutesPassed} دقائق`
                    : `${minutesPassed} دقيقة`}
        </h3>
      </div>
    </LoadingLink>
  ) : (
    <div className="mx-auto flex flex-col justify-center gap-2 p-2">
      <h3>
        <span className="text-rayanSecondary-dark">رقم الطلب:</span>{" "}
        {order.orderId}
      </h3>
      {statuses.map(
        (status) =>
          status.value === order.status && (
            <h3
              className={`${status.color}`}
              key={`${order.id} - ${order.status}`}
            >
              <span className="text-rayanSecondary-dark">الحالة:</span>{" "}
              {status.displayName}
            </h3>
          ),
      )}
      <h3>
        <span className="text-rayanSecondary-dark">منذ: </span>{" "}
        {minutesPassed >= 60
          ? hoursPassed >= 24
            ? daysPassed >= 30
              ? formattedDate
              : `${daysPassed} يوم`
            : `${hoursPassed} ساعة`
          : minutesPassed < 1
            ? "منذ أقل من دقيقة"
            : minutesPassed === 1
              ? "منذ دقيقة"
              : minutesPassed === 2
                ? "منذ دقيقتين"
                : minutesPassed > 2 && minutesPassed < 11
                  ? `${minutesPassed} دقائق`
                  : `${minutesPassed} دقيقة`}
      </h3>
      <h3>
        <span className="text-rayanSecondary-dark">طريقة الدفع: </span>{" "}
        <span className="text-rayanWarning-light">
          {order.paymentMethod === "card"
            ? "عن طريق البطاقة"
            : order.paymentMethod === "cash"
              ? "نقدا"
              : "عن طريق المحفظة"}
        </span>
      </h3>

      <h3>
        <span className="text-rayanSecondary-dark">المنطقة: </span>
        {order.contact?.district?.name}
      </h3>
      <h3>
        <span className="text-rayanSecondary-dark">رقم التواصل: </span>
        {order.contact?.contactNumber}
      </h3>
      <div className="mt-4 flex">
        <span className="text-rayanSecondary-dark">تفاصيل الطلب:</span>
        <div className="mr-4 w-full">
          {order.products.map((product) => (
            <LoadingLink
              target
              href={product?.productLink as string}
              key={product.id}
            >
              {product.name} x ${product.counter}
            </LoadingLink>
          ))}
          <h3>
            <span className="text-rayanSecondary-dark">اجمالي الفاتورة : </span>
            {order.billTotal}
          </h3>
        </div>
      </div>
      <h3>
        <span className="text-rayanSecondary-dark">التوصيل : </span>
        {order.contact.district.shippingFees}
      </h3>
      <h3>
        <span className="text-rayanSecondary-dark">اجمالي الطلب : </span>
        {order.orderTotal}
      </h3>
    </div>
  );
}
