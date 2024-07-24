'use server';
import { deleteCloudinaryImage, upload } from '@/cloudinary';
import db from '@/db/db';
import { addHours, addMinutes } from 'date-fns';
import { redirect } from 'next/navigation';
import { DateRange } from 'react-day-picker';
import z from 'zod';

const editPromoSchema = z.object({
	code: z.string().min(1, 'الرجاء ادخال هذا الحقل'),
	expired: z.string().optional(),
	discount: z.string().min(1, 'الرجاء ادخل قيمة الخصم'),
	promoType: z.string().min(1, 'الرجاء ادخل نوع الكوبون '),
});

export async function editPromo(
	date: DateRange | undefined,
	id: string,
	_prevState: unknown,
	formData: FormData,
) {
	const result = editPromoSchema.safeParse(
		Object.fromEntries(formData.entries()),
	);

	if (result.success === false)
		return result.error.formErrors.fieldErrors;

	const data = result.data;

	const currentPromo = await db.promoCode.findUnique({
		where: { id },
	});

	await db.promoCode.update({
		where: { id },
		data: {
			code: data.code || currentPromo?.code,
			discount:
				parseInt(data.discount) ||
				currentPromo?.discount,
			promoType: data.promoType || currentPromo?.promoType,
			expired: data.expired === 'on' ? false : true,
			startDate:
				data.expired === 'on'
					? (date?.from && addHours(date?.from, 3)) ||
					  currentPromo?.startDate
					: null,
			endDate:
				data.expired === 'on'
					? (date?.to && addMinutes(date.to, 1619)) ||
					  currentPromo?.endDate
					: null,
		},
	});

	redirect('/admin/settings/promo-codes');
}
