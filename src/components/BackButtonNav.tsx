'use client';
import { ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';

export default function BackButtonNav({
	bg = true,
	goHome,
	href = '',
}: {
	goHome?: boolean;
	bg?: boolean;
	href?: string;
}) {
	const router = useRouter();

	return (
		<>
			<nav
				className={`pb-2 ${
					bg ? 'bg-rayanPrimary-dark' : 'bg-none'
				}`}
			>
				<div className='max-w-screen-xl h-14 flex flex-wrap items-center justify-between mx-auto p-4'>
					<Button
						data-collapse-toggle='navbar-default'
						type='button'
						variant='outline'
						className={`${
							bg
								? 'text-white hover:bg-inherit bg-inherit border-none'
								: 'text-rayanPrimary-dark bg-inherit'
						} inline-flex items-center p-2 w-10 h-10 justify-center text-sm rounded-lg`}
						aria-controls='navbar-default'
						aria-expanded='false'
						onClick={() =>
							!goHome
								? href === ''
									? router.back()
									: router.replace(href)
								: router.replace('/')
						}
					>
						<span className='sr-only'>
							Go Back One Page
						</span>
						<ArrowRight />
					</Button>
				</div>
			</nav>
		</>
	);
}
