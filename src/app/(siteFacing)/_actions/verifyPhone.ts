"use server";
import db from "@/db/db";
import { z } from "zod";
import { checkIsVerificationCodeExpired } from "./registerPhone";

const addPhoneSchema = z.object({
  verificationCode: z.string().min(6, "رمز التحقق غير صحيح"),
});

export async function checkVerificationCode(
  currVerificationCode: string | undefined,
  _: unknown,
  formData: FormData,
): Promise<
  | { verificationCode: string | undefined; phone: string | undefined }
  | undefined
> {
  const result = await addPhoneSchema.safeParse(
    Object.fromEntries(formData.entries()),
  );

  if (result.success === false)
    return {
      verificationCode:
        result.error.formErrors.fieldErrors.verificationCode![0] || undefined,
      phone: undefined,
    };

  const data = result.data;

  const checkVerificationCode = await db.verificationCode.findUnique({
    where: { id: currVerificationCode },
  });

  if (
    !data.verificationCode ||
    !checkVerificationCode ||
    data.verificationCode !== checkVerificationCode.code
  )
    return {
      phone: undefined,
      verificationCode: " رمز التحقق غير صحيح",
    };

  if (!(await checkIsVerificationCodeExpired(checkVerificationCode)))
    return { phone: checkVerificationCode.phone, verificationCode: undefined };

  await db.verificationCode.delete({ where: { id: checkVerificationCode.id } });

  return {
    phone: undefined,
    verificationCode:
      "لقد انتهت صلاحية الرمز، أعد تحميل الصفحة وادخل رقم هاتفك مرة اخرى",
  };
}
