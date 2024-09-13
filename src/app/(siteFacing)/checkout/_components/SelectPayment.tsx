"use client";
import { ChangeEvent, FormEvent, ReactNode, useState } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { GrAtm } from "react-icons/gr";
import { GiTakeMyMoney } from "react-icons/gi";
import EWalletIcon from "@/app/icons8-e-wallet-48.png";
import Image from "next/image";
import SubmitButton from "@/components/SubmitButton";
import { createNewOrder } from "../../orders/_actions/createNewOrder";
import { useFormState } from "react-dom";
import DayTimePicker from "./DayTimePicker";

export default function SelectPayment() {
  const [deliveryMethod, setDeliveryMethod] = useState<"delivery" | "pickUp">(
    "delivery",
  );
  const [paymentMethod, setPaymentMethod] = useState<
    "card" | "cash" | "eWallet"
  >("cash");
  const [date, setDate] = useState<Date | undefined>();

  const [error, action] = useFormState(
    createNewOrder.bind(null, deliveryMethod === "pickUp" ? date : undefined),
    null,
  );

  const handleChange = (
    e: ChangeEvent<HTMLInputElement>,
    type: "payment" | "delivery",
  ) => {
    if (type === "delivery")
      setDeliveryMethod(e.target.value === "pickUp" ? "pickUp" : "delivery");
    if (type === "payment")
      setPaymentMethod(
        e.target.value === "eWallet"
          ? "eWallet"
          : e.target.value === "card"
            ? "card"
            : "cash",
      );
  };

  return (
    <form
      action={action}
      className="h-full w-full p-4 sm:w-1/2 md:w-1/3"
      dir="rtl"
    >
      <RadioGroup
        defaultValue={deliveryMethod}
        name="deliveryMethod"
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          handleChange(e, "delivery")
        }
      >
        <RadioCard value="delivery" htmlFor="delivery">
          توصيل للمنزل
        </RadioCard>
        <RadioCard value="pickUp" htmlFor="pickUp">
          استلام من الفرع
        </RadioCard>
      </RadioGroup>
      {error?.deliveryMethod && (
        <div className="text-destructive">{error?.deliveryMethod}</div>
      )}
      {deliveryMethod === "pickUp" && (
        <>
          <div className="group relative z-0 mb-5 w-full">
            <select
              name="storeToPickUpFrom"
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-3 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">اختر الفرع</option>
              {["شارع القدس", "حكما", "حنينا", "المطارق"].map((store) => (
                <option key={store} value={store}>
                  {store}
                </option>
              ))}
            </select>
            {error?.storeToPickUpFrom && (
              <div className="text-destructive">{error?.storeToPickUpFrom}</div>
            )}
          </div>
          <div className="group relative z-0 mb-5 w-full">
            <DayTimePicker selected={date} setSelected={setDate} />
          </div>
          {error?.pickUpDate && (
            <div className="mt-2 text-destructive">{error.pickUpDate}</div>
          )}
        </>
      )}

      <div className="group relative z-0 mb-5 w-full">
        <label
          htmlFor="note"
          className="mb-2 block text-sm font-medium text-gray-900"
        >
          تعليمات اضافية
        </label>
        <textarea
          id="note"
          rows={4}
          name="note"
          className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
          placeholder="اكتب أي تعليمات اضافية"
        />
      </div>

      {deliveryMethod === "delivery" && (
        <>
          <RadioGroup
            name="paymentMethod"
            defaultValue={paymentMethod}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              handleChange(e, "payment")
            }
          >
            <RadioCard value="cash" htmlFor="الدفع (نقدا) عند الاستلام">
              <div>
                الدفع <span className="text-rayanWarning-dark">( نقدا )</span>{" "}
                عند الاستلام
              </div>
              <GiTakeMyMoney size="20" />
            </RadioCard>

            <RadioCard value="card" htmlFor="الدفع (بالبطاقة) عند الاستلام">
              <div>
                الدفع{" "}
                <span className="text-rayanWarning-dark">( بالبطاقة )</span> عند
                الاستلام
              </div>
              <GrAtm size="20" />
            </RadioCard>
            <RadioCard value="eWallet" htmlFor="الدفع عن طريق المحفظة">
              <span>الدفع عن طريق المحفظة</span>
              <Image
                alt="e-wallet icon"
                src={EWalletIcon}
                width={20}
                height={20}
              />
            </RadioCard>
          </RadioGroup>
          {error?.paymentMethod && (
            <div className="text-destructive">{error.paymentMethod}</div>
          )}
        </>
      )}
      <SubmitButton className="mt-2" body="تنفيذ الطلب" />
    </form>
  );
}

function RadioCard({
  children,
  value,
  htmlFor,
}: {
  children: ReactNode;
  value: string;
  htmlFor: string;
}) {
  return (
    <div className="flex h-10 justify-between rounded-lg border-2 border-slate-400 bg-slate-50 p-2">
      <RadioGroupItem value={value} id={htmlFor} />
      <Label
        htmlFor={htmlFor}
        className="flex items-center justify-between gap-4 text-sm"
      >
        {children}
      </Label>
    </div>
  );
}
