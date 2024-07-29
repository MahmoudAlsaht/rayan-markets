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
import {
	ChangeEvent,
	useRef,
	useState,
	useTransition,
} from 'react';
import {
	deleteImage,
	editImage,
	addImageLink,
} from '@/app/admin/_actions/image';
import { Loader2 } from 'lucide-react';

export default function ClickableImageCard({
	image,
	imageAlt,
}: {
	image: Partial<TImage>;
	imageAlt: string;
}) {
	const router = useRouter();
	const [isPending, startTransition] = useTransition();
	const [file, setFile] = useState<File | null>(null);
	const [dialogType, setDialogType] = useState('');
	const linkRef = useRef<HTMLInputElement | null>(null);

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
			const id = image.id as string;
			await deleteImage(id);
			router.refresh();
		});
	};

	const handleAddLink = () => {
		startTransition(async () => {
			const link = linkRef.current?.value as string;
			const id = image.id as string;
			await addImageLink(id, link);
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
					<DropdownMenuItem className='text-rayanWarning-dark'>
						<label
							htmlFor={image.id}
							className='cursor-pointer'
						>
							تعديل الصورة
						</label>
					</DropdownMenuItem>
					<DropdownMenuItem
						className='cursor-pointer'
						onClick={() => setDialogType('addLink')}
					>
						<DialogTrigger>
							اضافة رابط للصورة
						</DialogTrigger>
					</DropdownMenuItem>
					<DropdownMenuItem
						className='text-destructive cursor-pointer'
						onClick={() => setDialogType('delete')}
					>
						<DialogTrigger>حذف الصورة</DialogTrigger>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
			<DialogContent>
				<DialogHeader>
					{dialogType === 'delete' && (
						<DialogTitle className='text-rayanError-dark'>
							حذف الصورة
						</DialogTitle>
					)}
					{dialogType === 'addLink' && (
						<DialogTitle>اضافة رابط</DialogTitle>
					)}
				</DialogHeader>
				<div className='grid gap-4 py-4'>
					<DialogFooter>
						{dialogType === 'delete' && (
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
						)}

						{dialogType === 'addLink' && (
							<div className='grid grid-cols-1 w-full'>
								<div className='relative z-0 w-full mb-5 group'>
									{image.link
										? `الرابط الحالي للصورة: ${image.link}`
										: 'لم يتم تحديد رابط للصورة'}
								</div>
								<div className='relative z-0 w-full mb-5 group'>
									<input
										type='text'
										ref={linkRef}
										id='link'
										className='block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer'
										placeholder=''
										defaultValue={
											image?.link ||
											undefined
										}
									/>
									<label
										htmlFor='link'
										className='peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6'
									>
										رابط للصورة
									</label>
								</div>
								<Button
									disabled={isPending}
									variant='outline'
									className='w-full'
									onClick={handleAddLink}
								>
									{isPending ? (
										<Loader2 className='animate-spin text-rayanPrimary-dark dark:text-rayanPrimary-light' />
									) : (
										'اضافة'
									)}
								</Button>
							</div>
						)}
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
