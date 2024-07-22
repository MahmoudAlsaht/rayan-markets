'use client';
import { useFormState } from 'react-dom';
import SubmitButton from '@/components/SubmitButton';
import { createNewBrand } from '../_actions/createNewBrand';
import Image from 'next/image';
import { editBrand } from '../_actions/editBrand';
import { Brand, Category } from '@prisma/client';
import { useRef, useState } from 'react';
import OfferDatePicker from './OfferDatePicker';
import { DateRange } from 'react-day-picker';
import { Trash2 } from 'lucide-react';

export function ProductForm({
	brand,
	categories,
	brands,
}: {
	brand?: {
		name: string;
		id: string;
		image: { path: string } | null;
		banner: {
			images: { path: string; id: string }[];
		} | null;
	} | null;
	brands: Partial<Brand>[];
	categories: Partial<Category>[];
}) {
	const [error, action] = useFormState(
		brand == null
			? createNewBrand
			: editBrand.bind(null, brand?.id as string),
		{},
	);

	const [productType, setProductType] = useState<
		string | null
	>(null);

	const [isOffer, setIsOffer] = useState(false);

	const [labels, setLabels] = useState<string[]>([]);
	const labelRef = useRef<HTMLInputElement | null>(null);

	const [date, setDate] = useState<DateRange | undefined>();

	return (
		<form
			action={action}
			className='max-w-sm h-[150dvh] mx-4 sm:mx-auto'
		>
			<div className='flex gap-1'>
				<div className='relative z-0 w-full mb-5 group'>
					<select
						name='category'
						className='bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3'
					>
						<option value=''>اختر القسم</option>
						{categories &&
							categories.map((category) => (
								<option
									key={category.id}
									value={category.id}
								>
									{category.name}
								</option>
							))}
					</select>
					{error?.name && (
						<div className='text-destructive'>
							{error?.name}
						</div>
					)}
				</div>

				<div className='relative z-0 w-full mb-5 group'>
					<select
						name='brand'
						className='bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3'
					>
						<option value=''>اختر العلامة</option>
						{brands &&
							brands.map((brand) => (
								<option
									key={brand.id}
									value={brand.id}
								>
									{brand.name}
								</option>
							))}
					</select>
					{error?.name && (
						<div className='text-destructive'>
							{error?.name}
						</div>
					)}
				</div>
			</div>

			<div className='relative z-0 w-full mb-5 group'>
				<input
					type='text'
					name='name'
					id='name'
					className='block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer'
					placeholder=''
					defaultValue={brand?.name}
				/>
				<label
					htmlFor='name'
					className='peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6'
				>
					الاسم المختصر
				</label>
				{error?.name && (
					<div className='text-destructive'>
						{error.name}
					</div>
				)}
			</div>

			<div className='relative z-0 w-full mb-5 group'>
				<input
					type='text'
					name='body'
					id='body'
					className='block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer'
					placeholder=''
					defaultValue={brand?.name}
				/>
				<label
					htmlFor='body'
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
				<input
					type='number'
					name='price'
					id='price'
					className='block no-arrows py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer'
					placeholder=''
					defaultValue={brand?.name}
				/>
				<label
					htmlFor='price'
					className='peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6'
				>
					السعر
				</label>
				{error?.name && (
					<div className='text-destructive'>
						{error.name}
					</div>
				)}
			</div>

			<div className='relative z-0 w-full mb-5 group'>
				<input
					type='number'
					name='quantity'
					id='quantity'
					className='block no-arrows py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer'
					placeholder=''
					defaultValue={brand?.name}
				/>
				<label
					htmlFor='quantity'
					className='peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6'
				>
					العدد المتوفر
				</label>
				{error?.name && (
					<div className='text-destructive'>
						{error.name}
					</div>
				)}
			</div>

			<div className='relative z-0 w-full mb-5 group'>
				<input
					type='text'
					name='label'
					id='label'
					className='block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer'
					placeholder=''
					defaultValue={brand?.name}
					ref={labelRef}
					onKeyDownCapture={async (e) => {
						if (e.key === 'Enter') {
							e.preventDefault();
							await setLabels((prevLabels) => [
								...prevLabels,
								labelRef.current
									?.value as string,
							]);
							labelRef.current!.value = '';
						}
					}}
				/>
				<label
					htmlFor='label'
					className='peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6'
				>
					الكلمات المفتاحية
				</label>
				<div className='grid grid-cols-4 gap-1'>
					{labels &&
						labels.map((label, index) => (
							<div
								key={`${index}-${label}`}
								className='relative bg-none text-rayanSecondary-dark border border-rayanSecondary-dark inline-flex items-center pl-2 py-2 pr-8 mt-2 text-sm font-medium text-center rounded-lg focus:ring-4'
							>
								{label}
								<div className='absolute inline-flex items-center justify-center w-5 h-5 cursor-pointer text-xs font-bold text-red-500 rounded-full -start-[-5px]'>
									<Trash2 />
								</div>
							</div>
						))}
				</div>
			</div>

			<div className='relative z-0 w-full mb-5 group'>
				<select
					name='productType'
					className='bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3'
					onChange={(e) =>
						setProductType(e.target.value)
					}
				>
					<option value=''>اختر نوع المنتج</option>
					<option value='normal'>عادي</option>
					<option value='options'>
						متعدد الخيارات
					</option>
					<option value='forHome'>منزلية</option>
				</select>
				{error?.name && (
					<div className='text-destructive'>
						{error?.name}
					</div>
				)}
			</div>

			{productType && productType === 'forHome' && (
				<div className='relative z-0 w-full mb-5 group'>
					<label
						htmlFor='description'
						className='block mb-2 text-sm font-medium text-gray-900'
					>
						وصف المنتج
					</label>
					<textarea
						id='description'
						rows={4}
						name='description'
						className='block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
						placeholder='وصف المنتج...'
					/>
				</div>
			)}

			<label className='inline-flex items-center cursor-pointer'>
				<input
					type='checkbox'
					className='sr-only peer'
					name='isOffer'
					onChange={(e) =>
						setIsOffer(e.target.checked)
					}
				/>
				<div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
				<span className='ms-3 text-sm font-medium text-gray-900'>
					{isOffer ? 'الغي العرض' : 'قدم عرضا'}
				</span>
			</label>

			{isOffer && (
				<>
					<div className='relative z-0 w-full mb-5 mt-3 group'>
						<input
							type='number'
							name='newPrice'
							id='newPrice'
							className='block no-arrows py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer'
							placeholder=''
							defaultValue={brand?.name}
						/>
						<label
							htmlFor='newPrice'
							className='peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6'
						>
							السعر الجديد
						</label>
						{error?.name && (
							<div className='text-destructive'>
								{error.name}
							</div>
						)}
					</div>
					<OfferDatePicker
						date={date}
						setDate={setDate}
					/>
				</>
			)}

			<div className='relative z-0 w-full mb-5 group'>
				<label
					className='block mb-2 text-gray-900'
					htmlFor='brandImage'
				>
					تحميل صورة العلامة
				</label>
				<input
					className='block w-full text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400'
					id='brandImage'
					name='brandImage'
					type='file'
				/>
				{brand && (
					<Image
						alt={brand?.name as string}
						src={brand?.image?.path || ''}
						width={100}
						height={100}
						className='mt-2 h-full w-1/6'
					/>
				)}
				{error?.brandImage && (
					<div className='text-destructive'>
						{error.brandImage}
					</div>
				)}
			</div>

			<SubmitButton
				body={brand == null ? 'إضافة' : 'تعديل'}
			/>
		</form>
	);
}
