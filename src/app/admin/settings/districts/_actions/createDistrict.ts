'use server';
import db from '@/db/db';
import { z } from 'zod';
import { redirect } from 'next/navigation';

const addDistrictSchema = z.object({
	name: z.string().min(1, 'يجب تحديد اسم المنطقة'),
	shippingFees: z.string().min(1, 'يجب تحديد تكلفة التوصيل'),
});

export const createNewDistrict = async (
	_pervState: unknown,
	formData: FormData,
) => {
	const result = await addDistrictSchema.safeParse(
		Object.fromEntries(formData.entries()),
	);

	if (result.success === false)
		return result.error.formErrors.fieldErrors;

	const data = result.data;

	const district = await db.district.findUnique({
		where: { name: data.name },
	});

	if (district !== null)
		return {
			name: 'هذه المنطقة مدعومة بالفعل',
			shippingFees: '',
		};

	await db.district.create({
		data: {
			name: data.name,
			shippingFees: parseFloat(data.shippingFees),
		},
	});

	redirect('/admin/settings/districts');
};
