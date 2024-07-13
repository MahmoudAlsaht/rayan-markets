'use client';

import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useFormState, useFormStatus } from 'react-dom';

import Link from 'next/link';
import { login } from '../../_actions/login';

export function LoginForm() {
	const [error, action] = useFormState(login, {});

	return (
		<form action={action} className='max-w-sm mx-auto'>
			<div className='relative z-0 w-full mb-5 group'>
				<input
					type='tel'
					name='phone'
					id='phone'
					className='block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer'
					placeholder=''
				/>
				<label
					htmlFor='phone'
					className='peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6'
				>
					الهاتف
				</label>
				{error?.phone && (
					<div className='text-destructive'>
						{error.phone}
					</div>
				)}
			</div>

			<div className='relative z-0 w-full mb-5 group'>
				<input
					type='password'
					name='password'
					id='password'
					className='block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer'
					placeholder=''
				/>
				<label
					htmlFor='password'
					className='peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6'
				>
					كلمة المرور
				</label>
				{error?.password && (
					<div className='text-destructive'>
						{error?.password}
					</div>
				)}
			</div>

			<div className='mb-4 text-sm'>
				ليس لديك حساب؟
				<Link
					href='/auth/register'
					className='underline'
				>
					التسجيل
				</Link>
			</div>
			<SubmitButton />
		</form>
	);
}

function SubmitButton() {
	const { pending } = useFormStatus();

	return (
		<Button
			className='w-full'
			type='submit'
			disabled={pending}
		>
			{pending ? (
				<Loader2 className='animate-spin text-rayanPrimary-dark dark:text-rayanPrimary-light' />
			) : (
				'التسجيل'
			)}
		</Button>
	);
}
