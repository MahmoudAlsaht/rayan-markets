'use client';

import { cn } from '@/lib/utils';
import { HomeIcon, Search, Settings2 } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ComponentProps } from 'react';

export default function BottomNavbar() {
	return (
		<main className='sm:hidden'>
			<div className='fixed z-50 w-full h-16 max-w-lg -translate-x-1/2 bg-white border border-gray-200 rounded-full bottom-4 left-1/2 dark:bg-gray-700 dark:border-gray-600'>
				<div className='grid h-full max-w-lg grid-cols-3 mx-auto'>
					<NavLink href='/products'>
						<Search />
						<span className='sr-only'>Products</span>
					</NavLink>
					<div
						id='tooltip-products'
						role='tooltip'
						className='absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700'
					>
						Products
						<div
							className='tooltip-arrow'
							data-popper-arrow
						></div>
					</div>

					<NavLink href='/'>
						<HomeIcon />
						<span className='sr-only'>Home</span>
					</NavLink>
					<div
						id='tooltip-home'
						role='tooltip'
						className='absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700'
					>
						Home
						<div
							className='tooltip-arrow'
							data-popper-arrow
						></div>
					</div>

					<NavLink href='/user-options'>
						<Settings2 />
						<span className='sr-only'>Options</span>
					</NavLink>
					<div
						id='tooltip-options'
						role='tooltip'
						className='absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700'
					>
						Options
						<div
							className='tooltip-arrow'
							data-popper-arrow
						></div>
					</div>
				</div>
			</div>
		</main>
	);
}

function NavLink(
	props: Omit<ComponentProps<typeof Link>, 'classNameName'>,
) {
	const pathname = usePathname();

	return (
		<Link
			{...props}
			className={cn(
				'inline-flex flex-col items-center justify-center px-5  group',
				pathname === props.href &&
					'bg-gray-100 dark:bg-gray-800',
			)}
		/>
	);
}
