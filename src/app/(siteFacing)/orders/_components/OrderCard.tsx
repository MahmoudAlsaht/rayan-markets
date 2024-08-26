"use client";
import { LoadingLink } from "@/context/LoadingContext";
import {
  Anonymous,
  Contact,
  District,
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
import { formatCurrency } from "@/lib/formatters";
import { Button } from "@/components/ui/button";
import { useTransition } from "react";
import { completeOrder, rejectOrCancelOrder } from "../_actions/updateOrder";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";

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
  note: string | null;
};

export function OrderCard({
  order,
  isOrderDetailsPage = false,
  user,
}: {
  order: OrderCardProp | null;
  isOrderDetailsPage?: boolean;
  user: {
    id: string;
    phone: string;
    username: string;
    role: string;
    profile: {
      id: string;
    } | null;
  } | null;
}) {
  const [isUpdating, startTransition] = useTransition();
  const router = useRouter();

  const now = new Date();
  const formattedDate = format(order?.createdAt as Date, "yyyy/MM/dd");
  const minutesPassed = differenceInMinutes(now, order?.createdAt as Date);
  const hoursPassed = differenceInHours(now, order?.createdAt as Date);
  const daysPassed = differenceInDays(now, order?.createdAt as Date);

  const generateDisplayDate = () =>
    minutesPassed >= 60
      ? hoursPassed >= 24
        ? daysPassed >= 30
          ? formattedDate
          : daysPassed === 1
            ? "يوم"
            : daysPassed === 2
              ? "يومين"
              : daysPassed > 2 && daysPassed < 11
                ? `${daysPassed} أيام`
                : `${daysPassed} يوماََ`
        : hoursPassed === 1
          ? "ساعة"
          : hoursPassed === 2
            ? "ساعتين"
            : hoursPassed > 2 && hoursPassed < 11
              ? `${hoursPassed} ساعات`
              : `${hoursPassed} ساعة`
      : minutesPassed < 1
        ? "أقل من دقيقة"
        : minutesPassed === 1
          ? "دقيقة"
          : minutesPassed === 2
            ? "دقيقتين"
            : minutesPassed > 2 && minutesPassed < 11
              ? `${minutesPassed} دقائق`
              : `${minutesPassed} دقيقة`;

  const handleRejectAndCancel = () => {
    startTransition(async () => {
      await rejectOrCancelOrder(
        order?.id as string,
        user?.role === "customer" ? "canceled" : "rejected",
      );
      router.refresh();
    });
  };

  const handleCompleteOrder = () => {
    startTransition(async () => {
      await completeOrder(order?.id as string, "finished");
      router.refresh();
    });
  };

  return !isOrderDetailsPage ? (
    <div className="rounded-2xl bg-white p-4 duration-500 hover:scale-105">
      <div className="flex flex-col justify-center gap-2 p-2">
        <h3>
          <span className="text-rayanSecondary-dark">رقم الطلب:</span>{" "}
          {order?.orderId}
        </h3>
        {statuses.map(
          (status) =>
            status.value === order?.status && (
              <h3
                className={`${status.color}`}
                key={`${order?.id} - ${order?.status}`}
              >
                <span className="text-rayanSecondary-dark">الحالة:</span>{" "}
                {status.displayName}
              </h3>
            ),
        )}
        <h3>
          <span className="text-rayanSecondary-dark">منذ: </span>{" "}
          {generateDisplayDate()}
        </h3>
        <LoadingLink
          className="flex items-center text-sky-400"
          href={`/orders/${order?.status}/${order?.id}`}
        >
          تفاصيل الطلب <MdOutlineKeyboardArrowLeft size={30} />
        </LoadingLink>
      </div>
    </div>
  ) : (
    <div className="mx-auto flex flex-col justify-center gap-2 p-2 text-sm sm:text-lg md:text-xl">
      <h3>
        <span className="text-rayanSecondary-dark">رقم الطلب: </span>{" "}
        {order?.orderId}
      </h3>
      {statuses.map(
        (status) =>
          status.value === order?.status && (
            <h3
              className={`${status.color}`}
              key={`${order?.id} - ${order?.status}`}
            >
              <span className="text-rayanSecondary-dark">الحالة:</span>{" "}
              {status.displayName}
            </h3>
          ),
      )}
      <h3>
        <span className="text-rayanSecondary-dark">منذ: </span>{" "}
        {generateDisplayDate()}
      </h3>
      <h3>
        <span className="text-rayanSecondary-dark">طريقة الدفع: </span>{" "}
        <span className="text-rayanWarning-light">
          {order?.paymentMethod === "card"
            ? "عن طريق البطاقة"
            : order?.paymentMethod === "cash"
              ? "نقدا"
              : "عن طريق المحفظة"}
        </span>
      </h3>

      <h3>
        <span className="text-rayanSecondary-dark">المنطقة: </span>
        {order?.contact?.district?.name}
      </h3>
      <h3>
        <span className="text-rayanSecondary-dark">رقم التواصل: </span>
        {order?.contact?.contactNumber}
      </h3>
      {order?.note && (
        <h3 className="text-rayanWarning-light">
          <span className="text-rayanSecondary-dark">الملاحظات: </span>
          {order?.note}
        </h3>
      )}
      <div className="mt-4 flex">
        <span className="w-38 text-rayanSecondary-dark">تفاصيل الطلب: </span>
        <div className="mr-1">
          {order?.products.map((product) => (
            <LoadingLink
              target
              href={product?.productLink as string}
              key={product.id}
              className="text-sky-400 hover:underline"
            >
              <span>
                {product.name}{" "}
                <sup className="text-destructive">{product.counter}X</sup>
              </span>
            </LoadingLink>
          ))}
          <h3>
            <span className="text-rayanSecondary-dark">اجمالي الفاتورة: </span>
            {formatCurrency(parseFloat(order?.billTotal.toFixed(2) as string))}
          </h3>
          {order?.promoCode && order.promoCode.promoType === "productPrice" && (
            <>
              <h3 className="text-rayanWarning-dark">
                <span className="text-rayanSecondary-dark">كوبون: </span>
                {`(${order.promoCode.code}) خصم ${order.promoCode.discount}% على الفاتورة`}
              </h3>
              <h3 className="text-destructive">
                <span className="text-rayanSecondary-dark">
                  خُصم من الفاتورة:{" "}
                </span>
                -
                {formatCurrency(
                  parseFloat(
                    (
                      order.billTotal *
                      ((order.promoCode.discount || 0) / 100)
                    ).toFixed(2),
                  ),
                )}
              </h3>
            </>
          )}
          <h3>
            <span className="text-rayanSecondary-dark">التوصيل: </span>
            {order?.contact.district.shippingFees}
          </h3>
          {order?.promoCode && order.promoCode.promoType === "shippingFees" && (
            <>
              <h3 className="text-rayanWarning-dark">
                <span className="text-rayanSecondary-dark">كوبون: </span>
                {`(${order.promoCode.code}) خصم ${order.promoCode.discount}% على التوصيل`}
              </h3>
              <h3 className="text-destructive">
                <span className="text-rayanSecondary-dark">
                  خُصم من رسوم التوصيل:{" "}
                </span>
                -
                {formatCurrency(
                  parseFloat(
                    (
                      (order?.contact?.district?.shippingFees || 0) *
                      ((order.promoCode.discount || 0) / 100)
                    ).toFixed(2),
                  ),
                )}
              </h3>
            </>
          )}
          {order?.promoCode && (
            <h3 className="text-rayanWarning-dark">
              <span className="text-rayanSecondary-dark">
                اجمالي الطلب قبل الخصم:{" "}
              </span>
              {formatCurrency(
                parseFloat(
                  (
                    (order?.contact?.district?.shippingFees || 0) +
                    (order?.billTotal || 0)
                  ).toFixed(2) as string,
                ),
              )}
            </h3>
          )}

          <h3>
            <span className="text-rayanSecondary-dark">اجمالي الطلب: </span>
            {formatCurrency(parseFloat(order?.orderTotal.toFixed(2) as string))}
          </h3>
        </div>
      </div>
      <div
        className={`mt-4 ${user?.role === "customer" || user?.role === "staff" ? "mx-auto w-full sm:w-10/12 md:w-8/12 lg:w-6/12" : "flex gap-1"}`}
      >
        {user &&
          (user.role == "admin" ||
            user.role === "editor" ||
            user?.role === "customer") && (
            <Button
              disabled={isUpdating || order?.status !== "pending"}
              className={`w-full ${order?.status === "pending" ? (user.role === "customer" ? "bg-destructive" : "bg-pink-700") : "cursor-text bg-foreground"}`}
              onClick={handleRejectAndCancel}
            >
              {isUpdating ? (
                <Loader2 className="animate-spin text-rayanPrimary-dark" />
              ) : order?.status === "pending" ? (
                user.role === "customer" ? (
                  "الغاء الطلب"
                ) : (
                  "رفض الطلب"
                )
              ) : order?.status === "canceled" ? (
                user.role === "customer" ? (
                  "لقد قمت بالغاء هذا الطلب"
                ) : (
                  "الغي الطلب من قبل العميل"
                )
              ) : order?.status === "rejected" ? (
                user.role === "customer" ? (
                  "لقد تم رفض طلبك"
                ) : (
                  "تم الرفض"
                )
              ) : (
                "تم التسليم"
              )}
            </Button>
          )}
        {user && order?.status === "pending" && user.role !== "customer" && (
          <Button
            disabled={isUpdating}
            className="w-full bg-sky-600"
            onClick={handleCompleteOrder}
          >
            {order?.status === "pending" && isUpdating ? (
              <Loader2 className="animate-spin text-rayanPrimary-dark" />
            ) : (
              "إتمام التسليم"
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
