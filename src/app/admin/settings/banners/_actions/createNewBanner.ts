'use server';
import { upload } from '@/cloudinary';
import db from '@/db/db';
import { redirect } from 'next/navigation';
import z, { date } from 'zod';

const bannerImageSchema = z
	.instanceof(File, { message: 'الرجاء اختر صورة للقسم' })
	.refine(
		(file) =>
			file.size === 0 || file.type.startsWith('image/'),
	);
const addBrandSchema = z.object({
	name: z.string().min(1, 'الرجاء ادخال هذا الحقل'),
	bannerType: z.string().min(1, 'الرجاء ادخال هذا الحقل'),
	bannerImages: bannerImageSchema.refine(
		(file) => file.size > 0,
		'الرجاء اختر صورة للعلامة',
	),
});

export async function createNewBanner(
	_prevState: unknown,
	formData: FormData,
) {
	const result = addBrandSchema.safeParse(
		Object.fromEntries(formData.entries()),
	);

	if (result.success === false)
		return result.error.formErrors.fieldErrors;

	const data = result.data;

	const checkBannerExists = await db.banner.findUnique({
		where: { name: data.name },
	});

	if (checkBannerExists != null)
		return {
			name: 'هذا الاسم موجود بالفعل',
			bannerImages: '',
			bannerType: '',
		};

	const bannerImages = formData.getAll(
		'bannerImages',
	) as File[];

	const bannerBasedOnType = await db.banner.findFirst({
		where: { bannerType: data.bannerType },
	});
	const imagesIds = await uploadBannerImages(bannerImages);

	if (bannerBasedOnType == null) {
		await db.banner.create({
			data: {
				name: data.name,
				bannerType: data.bannerType,
				images: {
					connect: imagesIds,
				},
			},
		});
		return redirect('/admin/settings/banners');
	}

	await db.banner.update({
		where: { id: bannerBasedOnType.id },
		data: {
			name: data.name || bannerBasedOnType.name,
			images: {
				connect: imagesIds,
			},
		},
	});

	redirect('/admin/settings/banners');
}

async function uploadBannerImages(files: File[]) {
	const uploadedImages: { id: string }[] = [];

	for (const file of files) {
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

	return uploadedImages;
}
