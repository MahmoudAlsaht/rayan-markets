'use server';
import { upload } from '@/cloudinary';
import db from '@/db/db';
import { redirect } from 'next/navigation';
import z from 'zod';

const brandImageSchema = z
	.instanceof(File, { message: 'الرجاء اختر صورة للقسم' })
	.refine(
		(file) =>
			file.size === 0 || file.type.startsWith('image/'),
	);
const addBrandSchema = z.object({
	name: z.string().min(1, 'الرجاء ادخال هذا الحقل'),
	brandImage: brandImageSchema.refine(
		(file) => file.size > 0,
		'الرجاء اختر صورة للعلامة',
	),
});

export async function createNewBrand(
	_prevState: unknown,
	formData: FormData,
) {
	const result = addBrandSchema.safeParse(
		Object.fromEntries(formData.entries()),
	);

	if (result.success === false)
		return result.error.formErrors.fieldErrors;

	const data = result.data;

	const checkBrandExists = await db.brand.findUnique({
		where: { name: data.name },
	});

	if (checkBrandExists != null)
		return {
			name: 'هذا القسم موجود بالفعل',
			brandImage: '',
		};

	const brandImage = await upload(data.brandImage);

	const newBrand = await db.brand.create({
		data: {
			name: data.name,
			image: {
				create: {
					imageType: 'BrandImage',
					filename: brandImage?.filename as string,
					path: brandImage?.path as string,
				},
			},
		},
	});

	const bannerFiles = formData.getAll('bannerImages') as
		| File[]
		| null;

	createBannerBrand(bannerFiles, newBrand.id, newBrand.name);

	redirect('/admin/settings/brands');
}

async function createBannerBrand(
	files: File[] | null,
	brandId: string,
	brandName: string,
) {
	const banner = await db.brand.update({
		where: { id: brandId },
		data: {
			banner: {
				create: {
					name: `banner for ${brandName}`,
					bannerType: 'BrandBanner',
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
