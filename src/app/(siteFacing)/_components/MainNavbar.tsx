'use client';
import Image from 'next/image';
import Link from 'next/link';
import Logo from '../../rayan.marketLogo.png';
import { usePathname, useRouter } from 'next/navigation';
import { ComponentProps } from 'react';
import { cn } from '@/lib/utils';
import { UserCircle } from 'lucide-react';
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User } from '@prisma/client';
import logout from '../auth/_actions/logout';
import SearchProducts from './SearchProducts';

export default function MainNavbar({
	user,
}: {
	user: Partial<User> | null;
}) {
	const router = useRouter();

	const pathname = usePathname();

	const isAccountPage =
		pathname === `/account/${user?.profileId}`;

	return (
		<nav
			className='hidden sm:block max-w-[1481.6px] mx-auto border-gray-200 dark:bg-[#C7E7E2]'
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
							<NavLink href='/'>الرئيسية</NavLink>
						</li>
						<li>
							<NavLink href='/products'>
								المنتجات
							</NavLink>
						</li>
						<li>
							<NavLink href='/products/offers'>
								العروض
							</NavLink>
						</li>
						<li>
							<NavLink href='/products/for-home'>
								المنزلية
							</NavLink>
						</li>

						<li className='hover:cursor-pointer'>
							<SearchProducts />
						</li>

						<li className='hover:cursor-pointer'>
							<DropdownMenu dir='rtl'>
								<DropdownMenuTrigger asChild>
									<UserCircle />
								</DropdownMenuTrigger>
								<DropdownMenuContent className='w-50'>
									{!user ? (
										<>
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
										</>
									) : (
										<>
											{!isAccountPage && (
												<DropdownMenuCheckboxItem
													className='hover:cursor-pointer hover:bg-gray-400 hover:text-white'
													onClick={() => {
														user.role ===
														'customer'
															? router.push(
																	`/account/${
																		user.profileId ||
																		'unRegisteredUser'
																	}`,
															  )
															: router.push(
																	'/admin',
															  );
													}}
												>
													{user.role ===
													'customer'
														? 'الصفحة الشخصية'
														: 'لوحة التحكم'}
												</DropdownMenuCheckboxItem>
											)}
											<DropdownMenuCheckboxItem
												className='hover:cursor-pointer hover:bg-gray-400 hover:text-white'
												onClick={async () => {
													await logout();
												}}
											>
												تسجيل الخروج
											</DropdownMenuCheckboxItem>
										</>
									)}
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
					'bg-gray-700 text-white px-6',
			)}
		/>
	);
}
