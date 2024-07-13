'use client';
import Image from 'next/image';
import Link from 'next/link';
import Logo from '../../rayan.marketLogo.png';
import { usePathname, useRouter } from 'next/navigation';
import { ComponentProps } from 'react';
import { cn } from '@/lib/utils';
import { Search, UserCircle } from 'lucide-react';
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function MainNavbar() {
	const router = useRouter();

	return (
		<nav
			className='hidden sm:block border-gray-200 dark:bg-[#C7E7E2]'
			dir='rtl'
		>
			<div className='max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4'>
				<Link
					href='/'
					className='flex items-center space-x-3 rtl:space-x-reverse'
				>
					<Image
						src={Logo}
						className='h-[50px] w-[80px]'
						alt='Al Rayan Logo'
					/>
				</Link>

				<div id='navbar-default'>
					<ul className='font-medium text-rayanSecondary-dark flex flex-row p-4 md:p-0 mt-4 rounded-lg  sm:space-x-8 rtl:space-x-reverse'>
						<li>
							<NavLink href='#'>الرئيسية</NavLink>
						</li>
						<li>
							<NavLink href='#'>المنتجات</NavLink>
						</li>
						<li>
							<NavLink href='#'>العروض</NavLink>
						</li>
						<li>
							<NavLink href='#'>المنزلية</NavLink>
						</li>

						<li className='hover:cursor-pointer'>
							<Search />
						</li>

						<li className='hover:cursor-pointer'>
							<DropdownMenu dir='rtl'>
								<DropdownMenuTrigger asChild>
									<UserCircle />
								</DropdownMenuTrigger>
								<DropdownMenuContent className='w-50'>
									<DropdownMenuCheckboxItem
										className='hover:cursor-pointer hover:bg-gray-400 hover:text-white'
										onClick={() =>
											router.push(
												'/auth/register',
											)
										}
									>
										التسجيل
									</DropdownMenuCheckboxItem>
									<DropdownMenuCheckboxItem
										className='hover:cursor-pointer hover:bg-gray-400 hover:text-white'
										onClick={() =>
											router.push(
												'/auth/login',
											)
										}
									>
										تسجيل الدخول
									</DropdownMenuCheckboxItem>
									<DropdownMenuCheckboxItem
										className='hover:cursor-pointer hover:bg-gray-400 hover:text-white'
										onClick={() =>
											router.push('#')
										}
									>
										الصفحة الشخصية
									</DropdownMenuCheckboxItem>
									<DropdownMenuCheckboxItem className='hover:cursor-pointer hover:bg-gray-400 hover:text-white'>
										تسجيل الخروج
									</DropdownMenuCheckboxItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</li>
					</ul>
				</div>
			</div>
		</nav>
	);
}

function NavLink(
	props: Omit<ComponentProps<typeof Link>, 'className'>,
) {
	const pathname = usePathname();

	return (
		<Link
			{...props}
			className={cn(
				'p-2 text-base font-normal rounded-lg transition duration-75 hover:text-white hover:bg-gray-700 group',
				pathname === props.href &&
					'bg-gray-700 text-white',
			)}
		/>
	);
}
