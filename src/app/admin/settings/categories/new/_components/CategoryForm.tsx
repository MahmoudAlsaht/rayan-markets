'use client';
import { useFormState } from 'react-dom';
import SubmitButton from '@/components/SubmitButton';
import { createNewCategory } from '../../_actions/createNewCategory';
import Image from 'next/image';
import ClickableImageCard from '@/components/ClickableImageCard';
import { editCategory } from '../../_actions/editCategory';

export function CategoryForm(category) {
	const [error, action] = useFormState(
		category == null
			? createNewCategory
			: editCategory.bind(null, category?.id as string),
		{},
	);

	return (
		<form
			action={action}
			className='max-w-sm h-screen mx-4 sm:mx-auto'
		>
			<div className='relative z-0 w-full mb-5 group'>
				<input
					type='text'
					name='name'
					id='name'
					className='block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer'
					placeholder=''
					defaultValue={category?.name}
				/>
				<label
					htmlFor='name'
					className='peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6'
				>
					الاسم
				</label>
				{error?.name && (
					<div className='text-destructive'>
						{error.name}
					</div>
				)}
			</div>

			<div className='relative z-0 w-full mb-5 group'>
				<label
					className='block mb-2 text-gray-900'
					htmlFor='categoryImage'
				>
					تحميل صورة القسم
				</label>
				<input
					className='block w-full text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400'
					id='categoryImage'
					name='categoryImage'
					type='file'
				/>
				{category && (
					<Image
						alt={category.name as string}
						src={category.image.path}
						width={100}
						height={100}
						className='mt-2 h-full w-1/6'
					/>
				)}
				{error?.categoryImage && (
					<div className='text-destructive'>
						{error.categoryImage}
					</div>
				)}
			</div>

			<div className='relative z-0 w-full mb-5 group'>
				<label
					className='block mb-2 text-gray-900'
					htmlFor='bannerImages'
				>
					تحميل صورة اللافتة
				</label>
				<input
					className='block w-full text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400'
					id='bannerImages'
					name='bannerImages'
					type='file'
					multiple
				/>
				<div className='grid grid-cols-2 gap-1 mt-2'>
					{category &&
						category.banner?.images.map((image) => (
							<ClickableImageCard
								key={image.id}
								id={image.id}
								image={image}
								imageAlt={`${category.name} banner's image`}
							/>
						))}
				</div>
			</div>
			<SubmitButton
				body={category == null ? 'إضافة' : 'تعديل'}
			/>
		</form>
	);
}
