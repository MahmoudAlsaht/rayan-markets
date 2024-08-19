"use server";
import db from "@/db/db";
import { redirect } from "next/navigation";
import { z } from "zod";

const phoneNumberRegex = /^(07[789]\d{7})$/;

const editContactSchema = z.object({
  isNewContactNumber: z.string().optional(),
  contactNumber: z
    .string()
    .regex(phoneNumberRegex, "رقم الهاتف المدخل غير صحيح!")
    .optional(),
  district: z.string().optional(),
  profileId: z.string().optional(),
});

export const editContact = async (
  contactId: string,
  profileId: string,
  prevPath: string,
  _: unknown,
  formData: FormData,
) => {
  const result = await editContactSchema.safeParse(
    Object.fromEntries(formData.entries()),
  );

  if (result.success === false) return result.error.formErrors.fieldErrors;

  if (!profileId) {
    return {
      isNewContactNumber: "",
      contactNumber: "",
      district: "",
      profileId: "نعتذر لقد حدثت مشكلة ما يرجى المحاولة لاحقا",
    };
  }

  const data = result.data;

  const currentContact = await db.contact.findUnique({
    where: { id: contactId },
    select: {
      district: true,
      id: true,
      contactNumber: true,
    },
  });

  await db.profile.update({
    where: { id: profileId },
    data: {
      contacts: {
        update: {
          where: { id: contactId },
          data: {
            districtId: data.district || currentContact?.district?.id,
            contactNumber: data.contactNumber || currentContact?.contactNumber,
          },
        },
      },
    },
  });

  redirect(
    prevPath === "contacts" ? `/account/${profileId}/contacts` : prevPath,
  );
};
