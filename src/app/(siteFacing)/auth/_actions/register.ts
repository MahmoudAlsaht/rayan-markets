'use server';
import db from '@/db/db';
import { hashPassword } from '@/lib/hashPassword';
import { z } from 'zod';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const phoneNumberRegex = /^(07[789]\d{7})$/;

const registerSchema = z
	.object({
		phone: z
			.string()
			.regex(
				phoneNumberRegex,
				'رقم الهاتف المدخل غير صحيح!',
			),
		username: z.string().min(1, 'يجب تحديد اسم المستخدم!'),
		password: z
			.string()
			.min(6, 'كلمة المرور يجب ان لا تكون اقل من 6 خانات'),
		confirmPassword: z
			.string()
			.min(
				6,
				'كلمة المرور يجب ان لا تكون اقل من 6 خانات &',
			),
	})
	.superRefine(({ confirmPassword, password }, ctx) => {
		if (confirmPassword !== password) {
			ctx.addIssue({
				code: 'custom',
				message: ' يجب أن تتطابق كلمتي المرور ',
				path: ['confirmPassword', 'password'],
			});
		}
	});

export const register = async (
	pervState: unknown,
	formData: FormData,
) => {
	const result = await registerSchema.safeParse(
		Object.fromEntries(formData.entries()),
	);

	if (result.success === false) {
		return result.error.formErrors.fieldErrors;
	}

	const data = result.data;

	const user = await db.user.findUnique({
		where: { phone: data.phone },
	});
	if (user !== null)
		return {
			phone: 'هذا الهاتف مسجل بالفعل',
			username: '',
			password: '',
			confirmPassword: '',
		};

	const newUser = await db.user.create({
		data: {
			phone: data.phone,
			username: data.username,
			password: await hashPassword(data.password),
			role: 'customer',
		},
	});

	const token = jwt.sign(
		{ id: newUser?.id, name: newUser?.username },
		process.env.SECRET_1,
	);

	const date = new Date();
	date.setTime(date.getTime() + 1000 * 60 * 60 * 24 * 60);

	cookies().set('token', token, {
		path: '/',
		expires: date,
	});

	redirect('/');
};
