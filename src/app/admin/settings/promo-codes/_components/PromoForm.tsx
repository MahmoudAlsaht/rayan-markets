'use client';
import { useFormState } from 'react-dom';
import SubmitButton from '@/components/SubmitButton';
import { createNewPromo } from '../_actions/createNewPromo';
import { useState } from 'react';
import { DateRange } from 'react-day-picker';
import { editPromo } from '../_actions/editPromo';
import OfferDatePicker from '../../products/_components/OfferDatePicker';

export function PromoForm({
	promo,
}: {
	promo?: {
		id: string;
		promoType: string;
		code: string;
		discount: number;
		expired: boolean;
		startDate: Date | null;
		endDate: Date | null;
	} | null;
}) {
	const [date, setDate] = useState<DateRange | undefined>({
		from: promo?.startDate || undefined,
		to: promo?.endDate || undefined,
	});

	const [expired, setExpired] = useState(true);

	const [error, action] = useFormState(
		promo == null
			? createNewPromo.bind(null, date)
			: editPromo.bind(null, date, promo.id),
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
					name='code'
					id='code'
					className='block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer'
					placeholder=''
					defaultValue={promo?.code}
				/>
				<label
					htmlFor='code'
					className='peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6'
				>
					كود الخصم
				</label>
				{error?.code && (
					<div className='text-destructive'>
						{error.code}
					</div>
				)}
			</div>

			<div className='relative z-0 w-full mb-5 group'>
				<input
					type='number'
					name='discount'
					id='discount'
					className='block no-arrows py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer'
					placeholder=''
					defaultValue={promo?.discount || ''}
				/>
				<label
					htmlFor='discount'
					className='peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6'
				>
					قيمة الخصم
				</label>
				{error?.discount && (
					<div className='text-destructive'>
						{error.discount}
					</div>
				)}
			</div>

			<div className='relative z-0 w-full mb-5 group'>
				<select
					name='promoType'
					className='bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3'
				>
					{promo ? (
						<option value={promo.promoType}>
							{promo.promoType === 'shippingFees'
								? 'خصم على التوصيل'
								: 'خصم على على سعر المنتج'}
						</option>
					) : (
						<option value=''>اختر نوع الخصم</option>
					)}
					{promo?.promoType !== 'shippingFees' && (
						<option value='shippingFees'>
							خصم على التوصيل
						</option>
					)}
					{promo?.promoType !== 'productPrice' && (
						<option value='productPrice'>
							خصم على سعر المنتجات
						</option>
					)}
				</select>

				{error?.promoType && (
					<div className='text-destructive'>
						{error?.promoType}
					</div>
				)}
			</div>
			<label className='inline-flex items-center cursor-pointer'>
				<input
					type='checkbox'
					className='sr-only peer'
					name='expired'
					onChange={(e) =>
						setExpired(e.target.checked)
					}
					checked={expired}
				/>
				<div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
				<span className='ms-3 text-sm font-medium text-gray-900'>
					{expired ? 'تفعيل الكود' : 'الغاء التفعيل'}
				</span>
			</label>

			<div>
				<OfferDatePicker date={date} setDate={setDate} />
			</div>

			<SubmitButton
				body={promo == null ? 'إضافة' : 'تعديل'}
			/>
		</form>
	);
}
