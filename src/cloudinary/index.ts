import {
	v2 as cloudinary,
	UploadApiErrorResponse,
	UploadApiResponse,
} from 'cloudinary';

type UploadResponse =
	| { success: true; result?: UploadApiResponse }
	| { success: false; error: UploadApiErrorResponse };

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_KEY,
	api_secret: process.env.CLOUDINARY_SECRET,
});

const imageUploader = (
	fileUri: string,
): Promise<UploadResponse> => {
	return new Promise((resolve, reject) => {
		cloudinary.uploader
			.upload(fileUri, {
				invalidate: true,
				folder: process.env.CLOUDINARY_FOLDER_NAME,
				use_filename: true,
				allowed_formats: [
					'jpeg',
					'png',
					'jpg',
					'gif',
					'webp',
				],
			})
			.then((result) => resolve({ success: true, result }))
			.catch((error) => {
				console.log('error comes from here');
				reject({ success: false, error });
			});
	});
};

export async function upload(file: File) {
	const fileBuffer = await file.arrayBuffer();

	const mimeType = file.type;
	const encoding = 'base64';
	const base64Data =
		Buffer.from(fileBuffer).toString('base64');

	const fileUri = `data:${mimeType};${encoding},${base64Data}`;

	const res = await imageUploader(fileUri);

	if (res.success) {
		return {
			path: res.result?.secure_url,
			filename: res.result?.public_id,
		};
	}

	return null;
}

export function deleteCloudinaryImage(filename: string) {
	cloudinary.uploader.destroy(filename, { invalidate: true });
}
