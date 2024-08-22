"use client";

import SubmitButton from "@/components/SubmitButton";
import { ChangeEvent, useState } from "react";
import { District } from "@prisma/client";
import { createNewContact } from "../_actions/createNewContact";
import { useFormState } from "react-dom";
import { editContact } from "../_actions/editContact";

export function ContactForm({
  user,
  districts,
  contact,
  redirectUrl,
}: {
  redirectUrl: string;
  user: {
    profile: {
      id: string;
    } | null;
    phone: string;
  } | null;
  districts: Partial<District>[];
  contact?: {
    id: string;
    contactNumber: string | null;
    district: {
      id: string;
      name: string;
      shippingFees: number;
      createdAt: Date;
      updatedAt: Date;
    } | null;
  } | null;
}) {
  const [isNewContactNumber, setIsNewContactNumber] = useState(
    contact ? user?.phone === contact.contactNumber : false,
  );

  const [error, contactAction] = useFormState(
    !contact
      ? createNewContact.bind(
          null,
          user?.profile?.id as string,
          redirectUrl as string,
        )
      : editContact.bind(
          null,
          contact.id as string,
          user?.profile?.id as string,
          redirectUrl as string,
        ),
    {},
  );

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) =>
    setIsNewContactNumber(e.target.checked);

  return (
    <form className="mx-4 max-w-sm sm:mx-auto" action={contactAction}>
      {error?.profileId && (
        <div className="text-destructive">{error.profileId}</div>
      )}
      <div className="group relative z-0 mb-1 w-full">
        <>
          <input
            type="tel"
            name="contactNumber"
            id="contactNumber"
            className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:focus:border-blue-500"
            placeholder=""
            disabled={isNewContactNumber && !contact}
            defaultValue={
              contact
                ? contact?.contactNumber || ""
                : isNewContactNumber
                  ? user?.phone
                  : ""
            }
            // value={!contact && isNewContactNumber ? user?.phone : ""}
          />
          <label
            htmlFor="contactNumber"
            className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 dark:text-gray-400 peer-focus:dark:text-blue-500 rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4"
          >
            رقم التواصل
          </label>
        </>

        {error?.contactNumber && (
          <div className="text-destructive">{error.contactNumber}</div>
        )}
      </div>

      {!contact && (
        <div className="group relative z-0 mb-5 w-full">
          <input
            type="checkbox"
            name="isNewContactNumber"
            id="isNewContactNumber"
            className="h-4 w-4 cursor-pointer rounded border-gray-300 bg-white text-blue-600 focus:ring-2 focus:ring-blue-500"
            checked={isNewContactNumber}
            onChange={handleOnChange}
          />
          <label
            htmlFor="isNewContactNumber"
            className="cursor-pointer pr-2 text-sm text-gray-500"
          >
            استعمل رقمي الشخصي
          </label>
          {error?.isNewContactNumber && (
            <div className="text-destructive">{error.isNewContactNumber}</div>
          )}
        </div>
      )}

      <div className="group relative z-0 mb-5 w-full">
        <select
          name="district"
          className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-3 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
        >
          <option value={contact?.district?.id || ""}>
            {contact?.district?.name || "اختر منطقة"}
          </option>
          {districts.map((district) =>
            !contact ? (
              <option key={district.id} value={district.id}>
                {district.name}
              </option>
            ) : (
              contact.district?.id !== district.id && (
                <option key={district.id} value={district.id}>
                  {district.name}
                </option>
              )
            ),
          )}
        </select>
        {error?.district && (
          <div className="text-destructive">{error?.district}</div>
        )}
      </div>

      <SubmitButton body={!contact ? "اضافة" : "حفظ"} />
    </form>
  );
}
