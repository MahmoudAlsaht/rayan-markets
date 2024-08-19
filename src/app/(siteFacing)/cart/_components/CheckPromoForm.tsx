"use client";
import { PromoCode } from "@prisma/client";
import { FormEvent, useRef, useState, useTransition } from "react";
import { checkPromoAndAddToCart } from "../../_actions/checkPromo";
import SubmitButton from "@/components/SubmitButton";
import { CheckIcon } from "lucide-react";

export default function CheckPromoForm() {
  const [_, startChecking] = useTransition();
  const [promo, setPromo] = useState<PromoCode | null>(null);
  const codeRef = useRef<HTMLInputElement | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    startChecking(async () => {
      const fetchedPromo = await checkPromoAndAddToCart(
        codeRef.current?.value as string,
      );
      setPromo(fetchedPromo);
    });
  };

  return (
    <form className="flex" onSubmit={handleSubmit}>
      <div className="group relative z-0 mb-5 w-full basis-11/12">
        <input
          type="text"
          id="code"
          className={`peer block w-full appearance-none border-0 border-b-2 border-gray-600 bg-transparent px-0 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-0 ${promo && promo.active ? "border-rayanPrimary-dark text-rayanPrimary-dark focus:border-rayanPrimary-dark" : "border-destructive text-destructive focus:border-destructive"}`}
          placeholder=""
          ref={codeRef}
        />
        <label
          htmlFor="code"
          className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 dark:text-gray-400 peer-focus:dark:text-blue-500 rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4"
        >
          كوبون الخصم
        </label>
      </div>
      <SubmitButton
        size="sm"
        body={`${promo?.active ? "فعال" : promo ? promo?.active && "غير فعال" : "تطبيق"}`}
        className={`basis-1/6 ${promo?.active ? "bg-rayanPrimary-dark" : promo ? !promo?.active && "bg-destructive" : ""}`}
      />
    </form>
  );
}
