"use server";
import db from "@/db/db";
import { z } from "zod";
import { VerificationCode } from "@prisma/client";
import { addMinutes, isAfter } from "date-fns";
import { sendVerificationCode } from "@/app/webhook/_actions/sendMessage";

const phoneNumberRegex = /^(07[789]\d{7})$/;

const addPhoneSchema = z.object({
  phone: z.string().regex(phoneNumberRegex, "رقم الهاتف المدخل غير صحيح!"),
});

export async function registerPhone(
  type: string,
  _: unknown,
  formData: FormData,
): Promise<
  | { phone: string | undefined; phoneVerification: string | undefined }
  | undefined
> {
  const result = await addPhoneSchema.safeParse(
    Object.fromEntries(formData.entries()),
  );

  if (result.success === false) {
    return {
      phone: result.error.formErrors.fieldErrors.phone![0] || undefined,
      phoneVerification: undefined,
    };
  }

  const data = result.data;

  if (type === "userPhone") {
    const user = await db.user.findUnique({
      where: { phone: data.phone },
    });

    if (user !== null)
      return {
        phone: "هذا الرقم مسجل بالفعل",
        phoneVerification: undefined,
      };
  }
  if (type === "resetPassword") {
    const user = await db.user.findUnique({
      where: { phone: data.phone },
    });

    if (!user)
      return {
        phone: "لم يتم العثور على حساب مرتبط بهذا الرقم",
        phoneVerification: undefined,
      };
  }

  const checkVerificationCode = await db.verificationCode.findUnique({
    where: { phone: data.phone },
  });

  if (!checkVerificationCode)
    return {
      phoneVerification: await createNewVerificationCode(data.phone),
      phone: undefined,
    };

  if (!(await checkIsVerificationCodeExpired(checkVerificationCode))) {
    await sendVerificationCode(
      checkVerificationCode.code,
      checkVerificationCode.phone,
    );
    return { phoneVerification: checkVerificationCode.id, phone: undefined };
  }

  await db.verificationCode.delete({ where: { id: checkVerificationCode.id } });

  return {
    phoneVerification: await createNewVerificationCode(data.phone),
    phone: undefined,
  };
}

function generateRandomSixDigit() {
  const min = 100000;
  const max = 999999;
  return `${Math.floor(Math.random() * (max - min + 1)) + min}`;
}

async function createNewVerificationCode(phone: string) {
  const verificationCode = await db.verificationCode.create({
    data: {
      phone: phone,
      code: generateRandomSixDigit(),
    },
  });

  await sendVerificationCode(verificationCode.code, verificationCode.phone);

  return verificationCode.id;
}

export async function checkIsVerificationCodeExpired(
  verificationCode: VerificationCode,
) {
  const createdAt = addMinutes(verificationCode.createdAt, 30);
  const isExpired = isAfter(new Date(), createdAt);
  return isExpired;
}
