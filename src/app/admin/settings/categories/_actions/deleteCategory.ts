'use server';

import { deleteCloudinaryImage } from '@/cloudinary';
import db from '@/db/db';

export async function deleteCategory(id: string) {
	const category = await db.category.findUnique({
		where: { id },
		select: {
			imageId: true,
			image: {
				select: {
					filename: true,
				},
			},
			bannerId: true,
			banner: {
				select: {
					images: {
						select: { id: true, filename: true },
					},
				},
			},
		},
	});

	if (category == null) return;
	await db.category.delete({ where: { id } });

	if (category?.image?.filename)
		deleteCloudinaryImage(
			category?.image.filename as string,
		);
	await db.image.delete({
		where: { id: category?.imageId as string },
	});

	if (category?.banner) {
		if (category?.banner.images.length > 0) {
			for (const image of category?.banner.images) {
				image.filename &&
					deleteCloudinaryImage(
						image.filename as string,
					);
				await db.image.delete({
					where: { id: image.id as string },
				});
			}
		}
		await db.banner.delete({
			where: { id: category?.bannerId as string },
		});
	}
}
