'use server';

import { deleteCloudinaryImage } from '@/cloudinary';
import db from '@/db/db';
import { revalidatePath } from 'next/cache';

export async function deleteBanner(id: string) {
	const banner = await db.banner.findUnique({
		where: { id },
		select: {
			id: true,
			bannerType: true,
			images: { select: { id: true, filename: true } },
		},
	});

	if (banner && banner?.images)
		for (const image of banner.images) {
			deleteCloudinaryImage(image.filename);
			await db.image.delete({ where: { id: image.id } });
		}

	await db.banner.delete({ where: { id } });

	banner?.bannerType === 'main' && revalidatePath('/');
	banner?.bannerType === 'offers' && revalidatePath('/offers');
}
