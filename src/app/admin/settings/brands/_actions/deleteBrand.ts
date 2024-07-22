'use server';

import { deleteCloudinaryImage } from '@/cloudinary';
import db from '@/db/db';

export async function deleteBrand(id: string) {
	const brand = await db.brand.findUnique({
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

	if (brand == null) return;
	await db.brand.delete({ where: { id } });

	if (brand?.image?.filename)
		deleteCloudinaryImage(brand?.image.filename as string);
	await db.image.delete({
		where: { id: brand?.imageId as string },
	});

	if (brand?.banner) {
		if (brand?.banner.images.length > 0) {
			for (const image of brand?.banner.images) {
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
			where: { id: brand?.bannerId as string },
		});
	}
}
