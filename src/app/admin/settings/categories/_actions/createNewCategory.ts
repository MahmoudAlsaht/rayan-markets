'use server';
import { upload } from '@/cloudinary';
import db from '@/db/db';
import { redirect } from 'next/navigation';
import z from 'zod';

const categoryImageSchema = z
	.instanceof(File, { message: 'الرجاء اختر صورة للقسم' })
	.refine(
		(file) =>
			file.size === 0 || file.type.startsWith('image/'),
	);
const addCategorySchema = z.object({
	name: z.string().min(1, 'الرجاء ادخال هذا الحقل'),
	categoryImage: categoryImageSchema.refine(
		(file) => file.size > 0,
		'الرجاء اختر صورة للقسم',
	),
});

export async function createNewCategory(
	_prevState: unknown,
	formData: FormData,
) {
	const result = addCategorySchema.safeParse(
		Object.fromEntries(formData.entries()),
	);

	if (result.success === false)
		return result.error.formErrors.fieldErrors;

	const data = result.data;

	const checkCategoryExists = await db.category.findUnique({
		where: { name: data.name },
	});

	if (checkCategoryExists != null)
		return {
			name: 'هذا القسم موجود بالفعل',
			categoryImage: '',
		};

	const categoryImage = await upload(data.categoryImage);

	const newCategory = await db.category.create({
		data: {
			name: data.name,
			image: {
				create: {
					imageType: 'CategoryImage',
					filename: categoryImage?.filename as string,
					path: categoryImage?.path as string,
				},
			},
		},
	});

	const bannerFiles = formData.getAll('bannerImages') as
		| File[]
		| null;

	createBannerCategory(
		bannerFiles,
		newCategory.id,
		newCategory.name,
	);

	redirect('/admin/settings/categories');
}

async function createBannerCategory(
	files: File[] | null,
	categoryId: string,
	categoryName: string,
) {
	const banner = await db.category.update({
		where: { id: categoryId },
		data: {
			banner: {
				create: {
					name: `banner for ${categoryName}`,
					bannerType: 'CategoryBanner',
				},
			},
		},
		select: {
			bannerId: true,
		},
	});

	if (files)
		for (const file of files) {
			if (file.size === 0) break;
			const bannerImage = await upload(file);
			await db.banner.update({
				where: { id: banner.bannerId as string },
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
