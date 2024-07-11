'use client';

import { Button } from '@/components/ui/button';
import { RefreshCcw } from 'lucide-react';
import { useEffect } from 'react';

export default function Error({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		// Log the error to an error reporting service
		console.error(error);
	}, [error]);
	return (
		<main
			className='flex flex-col justify-center items-center h-screen text-4xl sm:text-6xl text-rayanSecondary-dark'
			dir='rtl'
		>
			<div className='py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16'>
				<h1 className='mb-4 text-4xl font-extrabold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl dark:text-white'>
					هناك مشكلة!
				</h1>
				<div className='mb-8'>حدث شيء خطأ!</div>
				<div className='flex flex-col space-y-4 sm:flex-row sm:justify-center sm:space-y-0'>
					<Button
						className='px-8 bg-rayanSecondary-dark dark:bg-rayanSecondary-light'
						size='lg'
					>
						<RefreshCcw className='ml-4' />
						أعد المحاولة
					</Button>
				</div>
			</div>
		</main>
	);
}
