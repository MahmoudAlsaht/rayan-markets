'use server';
import { checkUser } from '@/app/(siteFacing)/auth/_actions/isAuthenticated';
import db from '@/db/db';
import { isValidPassword } from '@/lib/hashPassword';
import { redirect } from 'next/navigation';
import { z } from 'zod';

const phoneNumberRegex = /^(07[789]\d{7})$/;

const phoneSchema = z.object({
	phone: z
		.string()
		.regex(phoneNumberRegex, 'رقم الهاتف المدخل غير صحيح!'),
	password: z.string().min(1, 'يجب أن تقوم بإدخال هذا الحقل'),
});

export async function updatePhone(
	profileId: string,
	_prevState: unknown,
	formData: FormData,
) {
	const result = phoneSchema.safeParse(
		Object.fromEntries(formData.entries()),
	);
	if (result.success === false) {
		return result.error.formErrors.fieldErrors;
	}

	const currentUser = await checkUser();
	const wantToUpdateUser = await db.user.findFirst({
		where: { profileId: profileId },
	});

	if (
		currentUser == null ||
		wantToUpdateUser == null ||
		wantToUpdateUser.id !== currentUser.id
	) {
		return {
			phone: 'ليس لديك الصلاحية',
			password: 'ليس لديك الصلاحية',
		};
	}

	const data = result.data;

	if (
		!(await isValidPassword(
			data.password,
			wantToUpdateUser.password,
		))
	)
		return {
			phone: 'البيانات المدخلة غير صحيحة',
			password: 'البيانات المدخلة غير صحيحة',
		};

	await db.user.update({
		where: { id: wantToUpdateUser.id },
		data: { phone: data.phone },
	});

	redirect(`/account/${profileId}/account-settings`);
}
