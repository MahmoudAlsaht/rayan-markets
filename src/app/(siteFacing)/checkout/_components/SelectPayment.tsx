"use client";
import { ReactNode, useState } from "react";
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
import { setHours, setMinutes, setSeconds } from "date-fns";

export default function SelectPayment() {
  const [isPickUp, setIsPickUp] = useState(false);
  const [date, setDate] = useState<Date>(
    setSeconds(setMinutes(setHours(new Date(), 12), 0), 0),
  );

  const [error, action] = useFormState(
    createNewOrder.bind(null, isPickUp ? date : undefined),
    {},
  );

  return (
    <form
      action={action}
      className="h-full w-full p-4 sm:w-1/2 md:w-1/3"
      dir="rtl"
    >
      <label className="mb-2 inline-flex cursor-pointer items-center gap-2">
        <input
          type="checkbox"
          className="peer sr-only"
          name="isPickUp"
          onChange={(e) => setIsPickUp(e.target.checked)}
          checked={isPickUp}
        />
        <div className="peer relative h-6 w-11 rounded-full bg-gray-200 after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800 rtl:peer-checked:after:-translate-x-full"></div>
        {isPickUp ? "استلام من المحل" : "توصيل"}
      </label>
      {isPickUp && (
        <div className="group relative z-0 mb-5 w-full">
          <DayTimePicker selected={date} setSelected={setDate} />
          {error.pickUpDate && (
            <div className="mt-2 text-destructive">{error.pickUpDate}</div>
          )}
        </div>
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

      {!isPickUp && (
        <RadioGroup name="paymentMethod">
          <PaymentRadioCard value="cash" htmlFor="الدفع (نقدا) عند الاستلام">
            <div>
              الدفع <span className="text-rayanWarning-dark">( نقدا )</span> عند
              الاستلام
            </div>
            <GiTakeMyMoney size="20" />
          </PaymentRadioCard>

          <PaymentRadioCard
            value="card"
            htmlFor="الدفع (بالبطاقة) عند الاستلام"
          >
            <div>
              الدفع <span className="text-rayanWarning-dark">( بالبطاقة )</span>{" "}
              عند الاستلام
            </div>
            <GrAtm size="20" />
          </PaymentRadioCard>
          <PaymentRadioCard value="eWallet" htmlFor="الدفع عن طريق المحفظة">
            <span>الدفع عن طريق المحفظة</span>
            <Image
              alt="e-wallet icon"
              src={EWalletIcon}
              width={20}
              height={20}
            />
          </PaymentRadioCard>
        </RadioGroup>
      )}
      <SubmitButton className="mt-2" body="تنفيذ الطلب" />
    </form>
  );
}

function PaymentRadioCard({
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
