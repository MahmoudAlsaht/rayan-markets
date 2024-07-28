'use client';
import { useFormState } from 'react-dom';
import SubmitButton from '@/components/SubmitButton';
import { createNewSection } from '../_actions/createNewSection';
import Image from 'next/image';
import ClickableImageCard from '@/components/ClickableImageCard';
import { editSection } from '../_actions/editSection';
import { useState } from 'react';

export function SectionForm({
	section,
}: {
	section?: {
		id: string;
		name: string;
		type: string;
		cover: {
			path: string;
		} | null;
		sectionBanners: {
			id: string;
			path: string;
		}[];
	} | null;
}) {
	const [error, action] = useFormState(
		section == null
			? createNewSection
			: editSection.bind(null, section?.id as string),
		{},
	);

	return (
		<form
			action={action}
			className='max-w-sm h-screen mx-4 sm:mx-auto'
		>
			<div className='relative z-0 w-full mb-5 group'>
				<select
					name='type'
					className='bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3'
				>
					<option value={section ? section?.type : ''}>
						{section
							? section?.type === 'categories'
								? 'فئة'
								: 'علامة تجارية'
							: 'اختر نوع القسم'}
					</option>

					{section ? (
						section?.type !== 'categories' && (
							<option value={'categories'}>
								فئة
							</option>
						)
					) : (
						<option value={'categories'}>فئة</option>
					)}

					{section ? (
						section?.type !== 'brands' && (
							<option value={'brands'}>
								علامة تجارية
							</option>
						)
					) : (
						<option value={'brands'}>
							علامة تجارية
						</option>
					)}
				</select>
				{error?.type && (
					<div className='text-destructive'>
						{error?.type}
					</div>
				)}
			</div>
			<div className='relative z-0 w-full mb-5 group'>
				<input
					type='text'
					name='name'
					id='name'
					className='block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer'
					placeholder=''
					defaultValue={section?.name}
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
					htmlFor='sectionImage'
				>
					تحميل صورة القسم
				</label>
				<input
					className='block w-full text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400'
					id='sectionImage'
					name='sectionImage'
					type='file'
				/>
				{section && (
					<Image
						alt={section?.name as string}
						src={section?.cover?.path || ''}
						width={100}
						height={100}
						className='mt-2 h-full w-1/6'
					/>
				)}
				{error?.sectionImage && (
					<div className='text-destructive'>
						{error.sectionImage}
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
					{section &&
						section.sectionBanners?.map((image) => (
							<ClickableImageCard
								key={image.id}
								id={image.id}
								image={image}
								imageAlt={`${section.name} banner's image`}
							/>
						))}
				</div>
			</div>
			<SubmitButton
				body={section == null ? 'إضافة' : 'تعديل'}
			/>
		</form>
	);
}
