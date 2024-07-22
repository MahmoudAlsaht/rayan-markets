'use server';

import db from '@/db/db';

export const getAllProducts = async () => {
	const products = await db.product.findMany({
		select: {
			id: true,
			name: true,
			productType: true,

			// body: true,
			// price: true,
			// quantity: true,
			// description: true,
			// newPrice: true,
			// isOffer: true,
			// offerStartsAt: true,
			// offerEndsAt: true,
			// productOptions: true,

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
