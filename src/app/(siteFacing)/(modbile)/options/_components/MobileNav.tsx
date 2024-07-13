'use client';
import { ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function MobileNav() {
	const router = useRouter();

	return (
		<nav className='bg-rayanPrimary-dark '>
			<div className='max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4'>
				<button
					data-collapse-toggle='navbar-default'
					type='button'
					className='inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-white rounded-lg'
					aria-controls='navbar-default'
					aria-expanded='false'
					onClick={() => router.back()}
				>
					<span className='sr-only'>
						Open main menu
					</span>
					<ArrowRight />
				</button>
			</div>
		</nav>
	);
}
