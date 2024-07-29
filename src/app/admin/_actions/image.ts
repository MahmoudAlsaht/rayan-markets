'use server';
import { deleteCloudinaryImage, upload } from '@/cloudinary';
import db from '@/db/db';

export async function editImage(id: string, formData: FormData) {
	const file = formData.get('file') as File;

	if (!file || file.size === 0) return;

	const image = await db.image.findUnique({ where: { id } });

	if (image == null) return;

	const uploadedImage = await upload(file);

	if (uploadedImage == null) return;

	deleteCloudinaryImage(image.filename);
	await db.image.update({
		where: { id },
		data: {
			filename: uploadedImage.filename,
			path: uploadedImage.path,
		},
	});
}

export async function deleteImage(id: string) {
	const image = await db.image.findUnique({ where: { id } });

	if (image == null) return;

	deleteCloudinaryImage(image.filename);

	await db.image.delete({ where: { id } });
}

export async function addImageLink(id: string, link: string) {
	const image = await db.image.findUnique({ where: { id } });

	if (image == null) return;

	await db.image.update({
		where: { id },
		data: {
			link,
		},
	});
}
