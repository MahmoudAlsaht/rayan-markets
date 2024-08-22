"use server";
import db from "@/db/db";
import { redirect } from "next/navigation";
import { z } from "zod";

const phoneNumberRegex = /^(07[789]\d{7})$/;

const addContactSchema = z.object({
  isNewContactNumber: z.string().optional(),
  contactNumber: z
    .string()
    .regex(phoneNumberRegex, "رقم الهاتف المدخل غير صحيح!")
    .optional(),
  district: z.string().min(1, "يجب تحديد المنطقة"),
  profileId: z.string().optional(),
});

export const createNewContact = async (
  profileId: string,
  redirectUrl: string,
  _: unknown,
  formData: FormData,
) => {
  const result = await addContactSchema.safeParse(
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

  if (data.isNewContactNumber !== "on" && !data.contactNumber)
    return {
      isNewContactNumber: "رقم الهاتف المدخل غير صحيح!",
      contactNumber: "",
      district: "",
      profileId: "",
    };

  const user = await db.user.findFirst({
    where: { profileId },
    select: { phone: true },
  });

  const { contacts } = await db.profile.update({
    where: { id: profileId },
    data: {
      contacts: {
        create: {
          districtId: data.district,
          contactNumber:
            data.isNewContactNumber === "on" ? user?.phone : data.contactNumber,
        },
      },
    },
    select: {
      contacts: {
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  for (const contact of contacts) {
    if (contacts[contacts.length - 1].id !== contact.id) {
      await db.contact.update({
        where: { id: contact.id },
        data: { defaultContact: false },
      });
    }
  }

  redirect(redirectUrl);
};
