'use server';

import db from '@/db/db';

export const getAllPromos = async () => {
	const promos = await db.promoCode.findMany({
		select: {
			id: true,
			code: true,
			expired: true,
		},
	});

	return promos.map((promo, index) => ({
		...promo,
		index: index + 1,
	}));
};
