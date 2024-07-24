'use server';

import db from '@/db/db';
import { addHours } from 'date-fns';

export const getAllProducts = async () => {
	await db.product.updateMany({
		where: {
			offerEndsAt: {
				lt: addHours(new Date(), 3),
			},
		},
		data: {
			newPrice: null,
			isOffer: false,
			offerStartsAt: null,
			offerEndsAt: null,
		},
	});

	const products = await db.product.findMany({
		select: {
			id: true,
			name: true,
			productType: true,
			categoryId: true,
			brandId: true,
			image: {
				select: {
					path: true,
				},
			},
		},
	});

	const selectedProducts = products.map((product) => ({
		id: product.id,
		name: product.name,
		image: product.image?.path,
	}));

	return selectedProducts;
};