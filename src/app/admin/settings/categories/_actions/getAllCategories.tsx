'use server';

import db from '@/db/db';

export const getAllCategories = async () => {
	const categories = await db.category.findMany({
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

	const selectedCategories = categories.map((category) => ({
		id: category.id,
		name: category.name,
		categoryImage: category.image?.path,
		bannerImage:
			category.banner?.images &&
			category.banner?.images?.length > 0
				? category.banner?.images[0].path
				: 'no image',
	}));
	return selectedCategories;
};
