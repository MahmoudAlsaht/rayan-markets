import { Image as TImage } from '@prisma/client';
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from './ui/dialog';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from './ui/dropdown-menu';
import Image from 'next/image';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';
import { ChangeEvent, useState, useTransition } from 'react';
import {
	deleteImage,
	editImage,
} from '@/app/admin/_actions/image';
import { Loader2 } from 'lucide-react';

export default function ClickableImageCard({
	image,
	imageAlt,
	id,
}: {
	image: Partial<TImage>;
	imageAlt: string;
	id: string;
}) {
	const router = useRouter();
	const [isPending, startTransition] = useTransition();
	const [file, setFile] = useState<File | null>(null);

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) setFile(e.target.files[0]);
	};

	const handleClick = () => {
		const formData = new FormData();
		formData.append('file', file as File);
		startTransition(async () => {
			await editImage(image?.id as string, formData);
			router.refresh();
		});
	};

	const handleDelete = () => {
		startTransition(async () => {
			await deleteImage(image?.id as string);
			router.refresh();
		});
	};

	return (
		<Dialog>
			<DropdownMenu>
				<div className='flex flex-col'>
					<DropdownMenuTrigger asChild>
						<Image
							alt={imageAlt}
							src={image.path as string}
							className='w-full max-h-32 cursor-pointer'
							width={100}
							height={50}
						/>
					</DropdownMenuTrigger>
					{file && (
						<Button
							disabled={isPending}
							className='mt-2'
							size='sm'
							variant='outline'
							type='button'
							onClick={handleClick}
						>
							{!isPending ? (
								'حفظ'
							) : (
								<Loader2 className='animate-spin text-rayanPrimary-dark dark:text-rayanPrimary-light' />
							)}
						</Button>
					)}
				</div>
				<DropdownMenuContent>
					<DropdownMenuItem className='text-destructive cursor-pointer'>
						<DialogTrigger>حذف الصورة</DialogTrigger>
					</DropdownMenuItem>
					<DropdownMenuItem className='text-rayanWarning-dark'>
						<label
							htmlFor={image.id}
							className='cursor-pointer'
						>
							تعديل الصورة
						</label>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
			<DialogContent>
				<DialogHeader>
					<DialogTitle className='text-rayanError-dark'>
						حذف الصورة
					</DialogTitle>
				</DialogHeader>
				<div className='grid gap-4 py-4'>
					<DialogFooter>
						<Button
							disabled={isPending}
							variant='outline'
							className='w-full text-destructive bg-none hover:bg-destructive hover:text-white'
							onClick={handleDelete}
						>
							{isPending ? (
								<Loader2 className='animate-spin text-rayanPrimary-dark dark:text-rayanPrimary-light' />
							) : (
								'حذف'
							)}
						</Button>
					</DialogFooter>
				</div>
			</DialogContent>
			<input
				id={image.id}
				type='file'
				onChange={handleChange}
				className='hidden'
			/>
		</Dialog>
	);
}
