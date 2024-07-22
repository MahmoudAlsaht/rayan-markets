'use server';

import db from '@/db/db';

export const getAllBrands = async () => {
	const brands = await db.brand.findMany({
		select: {
			id: true,
			name: true,
			image: {
				select: {
					path: true,
				},
			},
			banner: {
				select: {
					images: {
						select: {
							path: true,
						},
					},
				},
			},
		},
	});

	const selectedBrands = brands.map((brand) => ({
		id: brand.id,
		name: brand.name,
		brandImage: brand.image?.path,
		bannerImage:
			brand.banner?.images &&
			brand.banner?.images?.length > 0
				? brand.banner?.images[0].path
				: 'no image',
	}));
	return selectedBrands;
};
