'use server';
import { deleteCloudinaryImage, upload } from '@/cloudinary';
import db from '@/db/db';
import { redirect } from 'next/navigation';
import z from 'zod';

const bannerImageSchema = z
	.instanceof(File, { message: 'الرجاء اختر صورة للقسم' })
	.refine(
		(file) =>
			file.size === 0 || file.type.startsWith('image/'),
	);

const editBannerSchema = z.object({
	name: z.string().min(1, 'الرجاء ادخال هذا الحقل'),
	bannerImages: bannerImageSchema.optional(),
});

export async function editBanner(
	id: string,
	_prevState: unknown,
	formData: FormData,
) {
	const result = editBannerSchema.safeParse(
		Object.fromEntries(formData.entries()),
	);

	if (result.success === false)
		return result.error.formErrors.fieldErrors;

	const data = result.data;
	const bannerImages = formData.getAll('bannerImages') as
		| File[]
		| null;

	const imagesIds = await uploadBannerImages(bannerImages);

	const currentBanner = await db.banner.findUnique({
		where: { id },
	});

	await db.banner.update({
		where: { id },
		data: {
			name: data.name || currentBanner?.name,
			images: {
				connect: imagesIds,
			},
		},
	});

	redirect('/admin/settings/banners');
}

async function uploadBannerImages(files: File[] | null) {
	const uploadedImages: { id: string }[] = [];

	if (files && files.length > 0)
		for (const file of files) {
			if (file.size > 0) {
				const image = await upload(file);
				if (image?.filename && image.path) {
					const newImage = await db.image.create({
						data: {
							imageType: 'BannerImage',
							filename: image?.filename as string,
							path: image?.path as string,
						},
					});
					uploadedImages.push({
						id: newImage.id,
					});
				}
			}
		}

	return uploadedImages;
}
