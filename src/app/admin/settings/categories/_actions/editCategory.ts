'use server';
import { deleteCloudinaryImage, upload } from '@/cloudinary';
import db from '@/db/db';
import { redirect } from 'next/navigation';
import z from 'zod';

const categoryImageSchema = z
	.instanceof(File, { message: 'الرجاء اختر صورة للقسم' })
	.refine(
		(file) =>
			file.size === 0 || file.type.startsWith('image/'),
	);

const editCategorySchema = z.object({
	name: z.string().min(1, 'الرجاء ادخال هذا الحقل'),
	categoryImage: categoryImageSchema.optional(),
});

export async function editCategory(
	id: string,
	_prevState: unknown,
	formData: FormData,
) {
	const result = editCategorySchema.safeParse(
		Object.fromEntries(formData.entries()),
	);

	if (result.success === false)
		return result.error.formErrors.fieldErrors;

	const data = result.data;

	const currentCategory = await db.category.findUnique({
		where: { id },
	});

	if (data.categoryImage && data.categoryImage.size > 0) {
		const currentCategoryImage = await db.image.findUnique({
			where: { id: currentCategory?.imageId as string },
		});
		if (
			currentCategoryImage &&
			currentCategoryImage.filename
		)
			deleteCloudinaryImage(currentCategoryImage.filename);
		const categoryImage = await upload(data.categoryImage);
		await db.image.update({
			where: { id: currentCategoryImage?.id as string },
			data: {
				filename: categoryImage?.filename,
				path: categoryImage?.path,
			},
		});
	}

	if (data.name !== currentCategory?.name)
		await db.category.update({
			where: { id },
			data: { name: data.name },
		});

	const bannerFiles = formData.getAll('bannerImages') as
		| File[]
		| null;

	updateBannerCategory(
		bannerFiles,
		currentCategory?.bannerId as string,
	);

	redirect('/admin/settings/categories');
}

async function updateBannerCategory(
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
