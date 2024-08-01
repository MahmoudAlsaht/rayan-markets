'use server';

import db from '@/db/db';
import { Product } from '@prisma/client';
import { addHours } from 'date-fns';

export type TProduct = Product & {
	image: { path: string };
};

function escapeRegExp(str: string) {
	return str?.replace(/[.@&*+?^${}()|[\]\\]/g, ''); // $& means the whole matched string
}

export async function searchProducts(
	prevState: unknown,
	formData: FormData,
): Promise<{ products?: TProduct[]; noProducts?: boolean }> {
	const query = escapeRegExp(formData.get('query') as string);

	if (query === '' || query == 'null')
		return { noProducts: true };

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

	await db.product.updateMany({
		where: {
			offerStartsAt: {
				gt: addHours(new Date(), 3),
			},
		},
		data: {
			isOffer: false,
		},
	});

	await db.product.updateMany({
		where: {
			AND: [
				{
					offerStartsAt: {
						lte: addHours(new Date(), 3),
					},
				},
				{
					offerEndsAt: {
						gt: addHours(new Date(), 3),
					},
				},
			],
		},
		data: {
			isOffer: true,
		},
	});

	const brands = await db.section.findFirst({
		where: {
			AND: [
				{
					name: {
						contains: query as string,
					},
					type: {
						equals: 'brands',
					},
				},
			],
		},
		select: {
			brandProducts: {
				select: {
					id: true,
					name: true,
					price: true,
					newPrice: true,
					image: {
						select: {
							path: true,
						},
					},
				},
			},
		},
	});

	if (brands && brands.brandProducts.length > 0)
		return { products: brands.brandProducts as TProduct[] };

	const categories = await db.section.findFirst({
		where: {
			AND: [
				{
					name: {
						contains: query as string,
					},
					type: {
						equals: 'categories',
					},
				},
			],
		},
		select: {
			categoryProducts: {
				select: {
					id: true,
					name: true,
					price: true,
					newPrice: true,
					image: {
						select: {
							path: true,
						},
					},
				},
			},
		},
	});

	if (categories && categories.categoryProducts.length > 0)
		return {
			products: categories.categoryProducts as TProduct[],
		};

	const products = await db.product.findMany({
		where: {
			OR: [
				{
					name: {
						contains: query as string,
					},
				},
				{
					body: {
						contains: query as string,
					},
				},
			],
		},
		select: {
			id: true,
			name: true,
			price: true,
			newPrice: true,
			image: {
				select: {
					path: true,
				},
			},
		},
	});

	if (products.length === 0) {
		const mostViewedProducts = await db.product.findMany({
			orderBy: { views: 'desc' },
			take: 6,
			select: {
				id: true,
				name: true,
				price: true,
				newPrice: true,
				image: {
					select: {
						path: true,
					},
				},
			},
		});
		const mostPurchasedProducts = await db.product.findMany({
			orderBy: { numberOfPurchases: 'desc' },
			take: 6,
			select: {
				id: true,
				name: true,
				price: true,
				newPrice: true,
				image: {
					select: {
						path: true,
					},
				},
			},
		});
		const mostResentProducts = await db.product.findMany({
			orderBy: { createdAt: 'desc' },
			take: 6,
			select: {
				id: true,
				name: true,
				price: true,
				newPrice: true,
				image: {
					select: {
						path: true,
					},
				},
			},
		});

		return {
			products: [
				...new Map(
					[
						...mostPurchasedProducts,
						...mostViewedProducts,
						...mostResentProducts,
					].map((product) => [product['id'], product]),
				).values(),
			] as TProduct[],
			noProducts: true,
		};
	}

	return { products: products as TProduct[] };
}
