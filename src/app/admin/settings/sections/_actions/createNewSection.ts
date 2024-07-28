'use server';
import { upload } from '@/cloudinary';
import db from '@/db/db';
import { redirect } from 'next/navigation';
import z from 'zod';

const SectionImageSchema = z
	.instanceof(File, { message: 'الرجاء اختر صورة للقسم' })
	.refine(
		(file) =>
			file.size === 0 || file.type.startsWith('image/'),
	);
const addSectionSchema = z.object({
	name: z.string().min(1, 'الرجاء ادخال هذا الحقل'),
	type: z.string().min(1, 'الرجاء اختيار نوع القسم'),
	sectionImage: SectionImageSchema.refine(
		(file) => file.size > 0,
		'الرجاء اختر صورة للقسم',
	),
});

export async function createNewSection(
	_prevState: unknown,
	formData: FormData,
) {
	const result = addSectionSchema.safeParse(
		Object.fromEntries(formData.entries()),
	);

	if (result.success === false)
		return result.error.formErrors.fieldErrors;

	const data = result.data;

	const checkSectionExists = (
		await db.section.findMany({
			where: { type: data.type },
		})
	).find((s) => s.name === data.name);

	if (checkSectionExists != undefined)
		return {
			name: 'هذا القسم موجود بالفعل',
			type: '',
			sectionImage: '',
		};

	const sectionImage = await upload(data.sectionImage);

	const newSection = await db.section.create({
		data: {
			name: data.name,
			type: data.type,
			cover: {
				create: {
					imageType: 'SectionCover',
					filename: sectionImage?.filename as string,
					path: sectionImage?.path as string,
				},
			},
		},
	});

	const bannerFiles = formData.getAll('bannerImages') as
		| File[]
		| null;

	createBannerSection(bannerFiles, newSection.id);

	redirect('/admin/settings/sections');
}

async function createBannerSection(
	files: File[] | null,
	sectionId: string,
) {
	if (files)
		for (const file of files) {
			if (file.size === 0) break;
			const bannerImage = await upload(file);
			await db.section.update({
				where: { id: sectionId },
				data: {
					sectionBanners: {
						create: {
							imageType: 'SectionBannerImage',
							filename:
								bannerImage?.filename as string,
							path: bannerImage?.path as string,
						},
					},
				},
			});
		}
}
