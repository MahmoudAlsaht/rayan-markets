'use server';
import { deleteCloudinaryImage, upload } from '@/cloudinary';
import db from '@/db/db';
import { redirect } from 'next/navigation';
import z from 'zod';

const brandImageSchema = z
	.instanceof(File, { message: 'الرجاء اختر صورة للقسم' })
	.refine(
		(file) =>
			file.size === 0 || file.type.startsWith('image/'),
	);

const editBrandSchema = z.object({
	name: z.string().min(1, 'الرجاء ادخال هذا الحقل'),
	brandImage: brandImageSchema.optional(),
});

export async function editBrand(
	id: string,
	_prevState: unknown,
	formData: FormData,
) {
	const result = editBrandSchema.safeParse(
		Object.fromEntries(formData.entries()),
	);

	if (result.success === false)
		return result.error.formErrors.fieldErrors;

	const data = result.data;

	const currentBrand = await db.brand.findUnique({
		where: { id },
	});

	if (data.brandImage && data.brandImage.size > 0) {
		const currentBrandImage = await db.image.findUnique({
			where: { id: currentBrand?.imageId as string },
		});
		if (currentBrandImage && currentBrandImage.filename)
			deleteCloudinaryImage(currentBrandImage.filename);
		const brandImage = await upload(data.brandImage);
		await db.image.update({
			where: { id: currentBrandImage?.id as string },
			data: {
				filename: brandImage?.filename,
				path: brandImage?.path,
			},
		});
	}

	if (data.name !== currentBrand?.name)
		await db.brand.update({
			where: { id },
			data: { name: data.name },
		});

	const bannerFiles = formData.getAll('bannerImages') as
		| File[]
		| null;

	updateBannerBrand(
		bannerFiles,
		currentBrand?.bannerId as string,
	);

	redirect('/admin/settings/brands');
}

async function updateBannerBrand(
	files: File[] | null,
	bannerId: string,
) {
	if (files && files.length > 0) {
		for (const file of files) {
			if (file.size === 0) break;
			const bannerImage = await upload(file);
			await db.banner.update({
				where: { id: bannerId as string },
				data: {
					images: {
						create: {
							imageType: 'BannerImage',
							filename:
								bannerImage?.filename as string,
							path: bannerImage?.path as string,
						},
					},
				},
			});
		}
	}
}
