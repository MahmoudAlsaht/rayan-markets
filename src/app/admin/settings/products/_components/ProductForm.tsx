'use client';
import { useFormState } from 'react-dom';
import SubmitButton from '@/components/SubmitButton';
import { createNewProduct } from '../_actions/createNewProduct';
import Image from 'next/image';
import { editProduct } from '../_actions/editProduct';
import { Brand, Category } from '@prisma/client';
import { useState } from 'react';
import OfferDatePicker from './OfferDatePicker';
import { DateRange } from 'react-day-picker';

export function ProductForm({
	product,
	categories,
	brands,
}: {
	product?: {
		name: string;
		weights: number[] | null;
		category: {
			id: string;
			name: string;
		} | null;
		id: string;
		brand: {
			id: string;
			name: string;
		} | null;
		body: string;
		price: number;
		quantity: number;
		productType: string;
		description: string | null;
		isOffer: boolean;
		newPrice: number | null;
		offerStartsAt: Date | null;
		offerEndsAt: Date | null;
		image: {
			path: string;
		} | null;
	} | null;

	brands: Partial<Brand>[];
	categories: Partial<Category>[];
}) {
	const [productType, setProductType] = useState<
		string | null
	>(product?.productType || null);

	const [isOffer, setIsOffer] = useState(product?.isOffer);

	const [date, setDate] = useState<DateRange | undefined>({
		from: product?.offerStartsAt || undefined,
		to: product?.offerEndsAt || undefined,
	});

	const [error, action] = useFormState(
		product == null
			? createNewProduct.bind(null, date)
			: editProduct.bind(
					null,
					date,
					product?.id as string,
			  ),
		{},
	);
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
						{product ? (
							<option
								value={
									product.category?.id != null
										? product.category?.id
										: ''
								}
							>
								{product.category?.name}
							</option>
						) : (
							<option value=''>اختر القسم</option>
						)}
						{categories &&
							categories.map((category) =>
								product ? (
									product.category?.id !==
										category.id && (
										<option
											key={category.id}
											value={category.id}
										>
											{category.name}
										</option>
									)
								) : (
									<option
										key={category.id}
										value={category.id}
									>
										{category.name}
									</option>
								),
							)}
					</select>
					{error?.category && (
						<div className='text-destructive'>
							{error?.category}
						</div>
					)}
				</div>

				<div className='relative z-0 w-full mb-5 group'>
					<select
						name='brand'
						className='bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3'
					>
						{product ? (
							<option
								value={
									product.brand?.id != null
										? product.brand?.id
										: ''
								}
							>
								{product.brand?.name}
							</option>
						) : (
							<option value=''>
								اختر العلامة
							</option>
						)}
						{brands &&
							brands.map((brand) =>
								product ? (
									product.brand?.id !==
										brand.id && (
										<option
											key={brand.id}
											value={brand.id}
										>
											{brand.name}
										</option>
									)
								) : (
									<option
										key={brand.id}
										value={brand.id}
									>
										{brand.name}
									</option>
								),
							)}
					</select>
					{error?.brand && (
						<div className='text-destructive'>
							{error?.brand}
						</div>
					)}
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
					{product ? (
						<option value={product.productType}>
							{product.productType === 'normal'
								? 'عادي'
								: product.productType ===
								  'forHome'
								? 'منزلية'
								: 'منتج بالوزن'}
						</option>
					) : (
						<option value=''>اختر نوع المنتج</option>
					)}
					{product?.productType !== 'normal' && (
						<option value='normal'>عادي</option>
					)}
					{product?.productType !== 'weight' && (
						<option value='weight'>
							منتج بالوزن
						</option>
					)}
					{product?.productType !== 'forHome' && (
						<option value='forHome'>منزلية</option>
					)}
				</select>
				{error?.productType && (
					<div className='text-destructive'>
						{error?.productType}
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
					defaultValue={product?.name}
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
					defaultValue={product?.body}
				/>
				<label
					htmlFor='body'
					className='peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6'
				>
					الاسم
				</label>
				{error?.body && (
					<div className='text-destructive'>
						{error.body}
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
					defaultValue={product?.price}
					step='any'
				/>
				<label
					htmlFor='price'
					className='peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6'
				>
					{productType === 'weight'
						? 'السعر للكيو الواحد'
						: 'السعر'}
				</label>
				{error?.price && (
					<div className='text-destructive'>
						{error.price}
					</div>
				)}
			</div>

			{productType === 'weight' && (
				<div className='relative z-0 w-full mb-5 group'>
					<input
						type='text'
						name='weights'
						id='weights'
						className='block no-arrows py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer'
						placeholder=''
						defaultValue={product?.weights?.join(
							' ',
						)}
						step='any'
					/>
					<label
						htmlFor='weights'
						className='peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6'
					>
						الأوزان
					</label>
					{error?.weights && (
						<div className='text-destructive'>
							{error.weights}
						</div>
					)}
				</div>
			)}

			<div className='relative z-0 w-full mb-5 group'>
				<input
					type='number'
					name='quantity'
					id='quantity'
					className='block no-arrows py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer'
					placeholder=''
					defaultValue={product?.quantity}
				/>
				<label
					htmlFor='quantity'
					className='peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6'
				>
					العدد المتوفر
				</label>
				{error?.quantity && (
					<div className='text-destructive'>
						{error.quantity}
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
						defaultValue={product?.description || ''}
					/>
					{error?.description && (
						<div className='text-destructive'>
							{error?.description}
						</div>
					)}
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
					checked={isOffer}
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
							defaultValue={
								product?.newPrice || ''
							}
							step='any'
						/>
						<label
							htmlFor='newPrice'
							className='peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6'
						>
							{productType === 'weight'
								? 'السعر الجديد للكيو الواحد'
								: 'السعر الجديد'}
						</label>
						{error?.newPrice && (
							<div className='text-destructive'>
								{error.newPrice}
							</div>
						)}
					</div>
					<div>
						<OfferDatePicker
							date={date}
							setDate={setDate}
						/>
					</div>
				</>
			)}

			<div className='relative z-0 w-full mb-5 group'>
				<label
					className='block mb-2 text-gray-900'
					htmlFor='productImage'
				>
					تحميل صورة العلامة
				</label>
				<input
					className='block w-full text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400'
					id='productImage'
					name='productImage'
					type='file'
				/>
				{product && (
					<Image
						alt={product?.name as string}
						src={product?.image?.path || ''}
						width={100}
						height={100}
						className='mt-2 h-full w-1/3'
					/>
				)}
				{error?.productImage && (
					<div className='text-destructive'>
						{error.productImage}
					</div>
				)}
			</div>

			<SubmitButton
				body={product == null ? 'إضافة' : 'تعديل'}
			/>
		</form>
	);
}
