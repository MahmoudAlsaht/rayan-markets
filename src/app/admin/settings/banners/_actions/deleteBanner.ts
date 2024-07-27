'use server';

import { deleteCloudinaryImage } from '@/cloudinary';
import db from '@/db/db';

export async function deleteBanner(id: string) {
	const banner = await db.banner.findUnique({
		where: { id },
		select: {
			id: true,
			images: { select: { id: true, filename: true } },
		},
	});

	if (banner && banner?.images)
		for (const image of banner.images) {
			deleteCloudinaryImage(image.filename);
			await db.image.delete({ where: { id: image.id } });
		}

	await db.banner.delete({ where: { id } });
}
