'use client';
import { useFormState } from 'react-dom';
import SubmitButton from '@/components/SubmitButton';
import ClickableImageCard from '@/components/ClickableImageCard';
import { editBanner } from '../_actions/editBanner';
import { createNewBanner } from '../_actions/createNewBanner';
import { useState } from 'react';

export function BannerForm({
	banner,
}: {
	banner?: {
		id: string;
		name: string;
		bannerType: string;
		images: {
			path: string;
			id: string;
		}[];
		brand: {
			id: string;
			name: string;
		} | null;
		category: {
			id: string;
			name: string;
		} | null;
	} | null;
}) {
	const [error, action] = useFormState(
		banner == null
			? createNewBanner
			: editBanner.bind(null, banner?.id as string),
		{},
	);
	const [bannerType, setBannerType] = useState<string | null>(
		banner?.bannerType || null,
	);

	return (
		<form
			action={action}
			className='max-w-sm h-screen mx-4 sm:mx-auto'
		>
			{!banner && (
				<div className='relative z-0 w-full mb-5 group'>
					<select
						name='bannerType'
						className='bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3'
						onChange={(e) => {
							setBannerType(e.target.value);
						}}
					>
						<option value=''>
							اختر نوع اللافتة
						</option>
						<option value='MainBanner'>
							للرئيسية
						</option>
						<option value='OfferBanner'>
							للعروض
						</option>
					</select>
					{error?.bannerType && (
						<div className='text-destructive'>
							{error?.bannerType}
						</div>
					)}
				</div>
			)}

			<div className='relative z-0 w-full mb-5 group'>
				<input
					type='text'
					name='name'
					id='name'
					className='block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer'
					placeholder=''
					defaultValue={banner?.name}
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
				{error?.bannerImages && (
					<div className='text-destructive'>
						{error.bannerImages}
					</div>
				)}
				<div className='grid grid-cols-2 gap-1 mt-2'>
					{banner &&
						banner?.images.map((image) => (
							<ClickableImageCard
								key={image.id}
								id={image.id}
								image={image}
								imageAlt={`${banner.name} banner's image`}
							/>
						))}
				</div>
			</div>
			<SubmitButton
				body={banner == null ? 'إضافة' : 'تعديل'}
			/>
		</form>
	);
}
