'use server';
import db from '@/db/db';
import { addHours, addMinutes } from 'date-fns';
import { redirect } from 'next/navigation';
import { DateRange } from 'react-day-picker';
import z from 'zod';

const addPromoSchema = z.object({
	code: z.string().min(1, 'الرجاء ادخال هذا الحقل'),
	expired: z.string(),
	discount: z.string().min(1, 'الرجاء ادخل قيمة الخصم'),
	promoType: z.string().min(1, 'الرجاء ادخل نوع الكوبون '),
});

export async function createNewPromo(
	date: DateRange | undefined,
	_prevState: unknown,
	formData: FormData,
) {
	const result = addPromoSchema.safeParse(
		Object.fromEntries(formData.entries()),
	);

	if (result.success === false)
		return result.error.formErrors.fieldErrors;

	const data = result.data;

	const checkPromoExists = await db.promoCode.findFirst({
		where: { code: data.code },
	});

	if (checkPromoExists != null)
		return {
			code: 'هذا القسم موجود بالفعل',
			expired: '',
			discount: '',
			promoType: '',
		};

	const newPromo = await db.promoCode.create({
		data: {
			code: data.code,
			discount: parseInt(data.discount) || 0,
			promoType: data.promoType,
			expired: data.expired === 'on' ? false : true,
			startDate:
				data.expired === 'on'
					? date?.from && addHours(date?.from, 3)
					: null,
			endDate:
				data.expired === 'on'
					? date?.to && addMinutes(date.to, 1619)
					: null,
		},
	});

	redirect('/admin/settings/promo-codes');
}
