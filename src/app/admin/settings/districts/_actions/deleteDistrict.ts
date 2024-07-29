'use server';
import db from '@/db/db';

export const deleteDistrict = async (id: string) => {
	await db.district.delete({
		where: { id },
	});
};
