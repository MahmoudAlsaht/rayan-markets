'use client';
import SubmitButton from '@/components/SubmitButton';
import { Button } from '@/components/ui/button';
import { Label } from '@prisma/client';
import { Loader2, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useRef, useState, useTransition } from 'react';
import { createNewLabels } from '../[id]/labels/_actions/createNewLabel';
import { deleteLabel } from '../[id]/labels/_actions/deleteLabel';

export default function LabelForm({
	labels,
	productId,
}: {
	labels: Label[] | undefined;
	productId: string;
}) {
	const router = useRouter();
	const [selectedLabels, setSelectedLabels] = useState<
		{ value: string; id?: number }[]
	>([]);
	const [isPending, startTransition] = useTransition();

	const labelRef = useRef<HTMLInputElement | null>(null);

	const handleClick = () => {
		startTransition(async () => {
			const formData = new FormData();
			for (const label of selectedLabels) {
				formData.append('labels', label.value);
			}
			await createNewLabels(formData, productId);
			setSelectedLabels([]);
			router.refresh();
		});
	};

	const addToSelectedLabel = async () => {
		await setSelectedLabels((prevLabels) => [
			...prevLabels,
			{ value: labelRef.current?.value as string },
		]);
		setSelectedLabels((prevLabels) => {
			return prevLabels.map((label, index) => {
				return { value: label.value, id: index };
			});
		});
		labelRef.current!.value = '';
	};

	const handleDeleteSelectedLabels = (id: number) => {
		setSelectedLabels((prevLabels) => {
			return prevLabels.filter((label) => label.id !== id);
		});
	};

	const handleDeleteCurrentLabels = (id: string) => {
		startTransition(async () => {
			await deleteLabel(productId, id);
			router.refresh();
		});
	};

	return (
		<div className='max-w-sm h-[150dvh] mx-4 sm:mx-auto'>
			{labels && labels.length > 0 && (
				<h1>الكلمات الحالية</h1>
			)}
			<div className='grid grid-cols-4 gap-1 mb-4'>
				{labels &&
					labels.map((label) => (
						<LabelPill
							key={label.id}
							id={label.id}
							value={label.value}
							handleDelete={
								handleDeleteCurrentLabels
							}
						/>
					))}
			</div>

			{selectedLabels && selectedLabels.length > 0 && (
				<h1>الكلمات الجديدة</h1>
			)}
			<div className='grid grid-cols-4 gap-1 mb-4'>
				{selectedLabels &&
					selectedLabels.map((label, index) => (
						<LabelPill
							key={label.id || index}
							id={label.id || index}
							value={label.value}
							handleDelete={
								handleDeleteSelectedLabels
							}
						/>
					))}
			</div>
			<div className='relative z-0 w-full mb-5 group'>
				<input
					type='text'
					name='label'
					id='label'
					className='block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer'
					placeholder=''
					ref={labelRef}
					onKeyDownCapture={async (e) => {
						if (e.key === 'Enter') {
							e.preventDefault();
							addToSelectedLabel();
						}
					}}
				/>
				<label
					htmlFor='label'
					className='peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6'
				>
					الكلمات المفتاحية
				</label>
			</div>

			<div className='relative z-0 w-full mb-5 group'>
				<Button
					onClick={handleClick}
					className='w-full'
					disabled={isPending}
				>
					{isPending ? (
						<Loader2 className='animate-spin' />
					) : (
						'حفظ'
					)}
				</Button>
			</div>
		</div>
	);
}

function LabelPill({
	id,
	value,
	handleDelete,
}: {
	id: string | number | null;
	value: string | null;
	handleDelete: (id: any) => void;
}) {
	return (
		<div
			key={id || ''}
			className='relative bg-none text-rayanSecondary-dark border border-rayanSecondary-dark inline-flex items-center pl-2 py-2 pr-8 mt-2 text-sm font-medium text-center rounded-lg focus:ring-4'
		>
			{value}
			<div className='absolute inline-flex items-center justify-center w-5 h-5 cursor-pointer text-xs font-bold text-red-500 rounded-full -start-[-5px]'>
				<Trash2 onClick={() => handleDelete(id)} />
			</div>
		</div>
	);
}
