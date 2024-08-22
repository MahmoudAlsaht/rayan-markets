import { ReactNode } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { GrAtm } from "react-icons/gr";
import { GiTakeMyMoney } from "react-icons/gi";
import EWalletIcon from "@/app/icons8-e-wallet-48.png";
import Image from "next/image";
import SubmitButton from "@/components/SubmitButton";
import { createNewOrder } from "../../orders/_actions/createNewOrder";

export default function SelectPayment() {
  return (
    <form
      action={createNewOrder}
      className="h-full w-full p-4 sm:w-1/2 md:w-1/3"
      dir="rtl"
    >
      <RadioGroup name="paymentMethod">
        <PaymentRadioCard value="cash" htmlFor="الدفع (نقدا) عند الاستلام">
          <div>الدفع ( نقدا ) عند الاستلام</div>
          <GiTakeMyMoney size="20" />
        </PaymentRadioCard>

        <PaymentRadioCard value="card" htmlFor="الدفع (بالبطاقة) عند الاستلام">
          <div>الدفع ( بالبطاقة ) عند الاستلام</div>
          <GrAtm size="20" />
        </PaymentRadioCard>
        <PaymentRadioCard value="eWallet" htmlFor="الدفع عن طريق المحفظة">
          <span>الدفع عن طريق المحفظة</span>
          <Image alt="e-wallet icon" src={EWalletIcon} width={20} height={20} />
        </PaymentRadioCard>
      </RadioGroup>

      {/* {error?.paymentMethod && (
        <div className="my-2 text-destructive">{error.paymentMethod}</div>
      )} */}
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
