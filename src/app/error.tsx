'use client';

import { Button } from '@/components/ui/button';
import { MoveRight, RefreshCcw } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Error({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	const router = useRouter();

	useEffect(() => {
		// Log the error to an error reporting service
		console.error(error.message);
	}, [error]);
	return (
		<main
			className='flex flex-col justify-center items-center h-screen text-4xl sm:text-6xl text-rayanSecondary-dark'
			dir='rtl'
		>
			<div className='py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16'>
				<h1 className='mb-4 text-destructive text-4xl font-extrabold tracking-tight leading-none md:text-5xl lg:text-6xl'>
					حدثت مشكلة ما
				</h1>
				<div className='mb-8 text-destructive'>
					يرجى المحاولة لاحقا
				</div>
				<div className='flex flex-col space-y-4 sm:flex-row sm:justify-center sm:space-y-0'>
					<Button
						className='px-8 bg-rayanSecondary-dark dark:bg-rayanSecondary-light'
						size='lg'
					>
						<RefreshCcw className='ml-4' />
						أعد المحاولة
					</Button>
				</div>
				<div className='flex flex-col space-y-4 sm:flex-row sm:justify-center sm:space-y-0 mt-4'>
					<Button
						className='px-8 bg-rayanSecondary-dark dark:bg-rayanSecondary-light'
						size='lg'
						onClick={() => router.replace('/')}
					>
						<MoveRight className='ml-4' />
						الرئيسية{' '}
					</Button>
				</div>
			</div>
		</main>
	);
}
