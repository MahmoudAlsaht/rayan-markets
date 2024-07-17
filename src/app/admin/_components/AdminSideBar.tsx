'use client';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { LogOut, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ComponentProps, useState } from 'react';
import logout from '@/app/(siteFacing)/auth/_actions/logout';
import {
	adminPermissions,
	editorPermissions,
	staffPermissions,
	UserPermission,
} from './UserPermissions';

export default function AdminSideBar({
	admin,
	editor,
	staff,
	profile,
}: UserPermission) {
	const [show, setShow] = useState(false);

	const toggleShow = () => setShow(!show);

	const router = useRouter();

	return (
		<>
			<div className='text-center'>
				<Button
					variant='ghost'
					className='p-2 w-10 h-10 text-sm rounded-lg'
					type='button'
					data-drawer-target='drawer-navigation'
					data-drawer-show='drawer-navigation'
					aria-controls='drawer-navigation'
					onClick={toggleShow}
				>
					<Menu className='text-rayanPrimary-dark' />
				</Button>
			</div>

			<aside
				id='default-sidebar'
				className={`${
					!show && 'hidden'
				} fixed top-0 left-0 z-40 w-full sm:w-64 h-dvh transition-transform sm:translate-x-0`}
			>
				<div className='overflow-y-auto py-5 px-3 h-full bg-white border-r border-gray-300'>
					<ul className='space-y-2'>
						<li>
							<Button
								variant='ghost'
								className='flex items-center p-2 pl-0 text-base font-normal text-gray-900 rounded-lg hover:bg-gray-700 hover:text-white group'
								onClick={toggleShow}
							>
								<span className='ml-3'>
									<X className='text-rayanPrimary-dark' />
								</span>
							</Button>
						</li>

						{admin &&
							adminPermissions(
								profile || 'unRegisteredUser',
							).map(
								(setting) =>
									setting && (
										<SideLink
											key={
												setting.displayName
											}
											href={setting.href}
										>
											{setting.icon}

											<span className='ml-3 mr-2'>
												{
													setting.displayName
												}
											</span>
										</SideLink>
									),
							)}

						{editor &&
							editorPermissions(
								profile || 'unRegisteredUser',
							).map(
								(setting) =>
									setting && (
										<SideLink
											key={
												setting.displayName
											}
											href={setting.href}
										>
											{setting.icon}

											<span className='ml-3 mr-2'>
												{
													setting.displayName
												}
											</span>
										</SideLink>
									),
							)}

						{staff &&
							staffPermissions(
								profile || 'unRegisteredUser',
							).map(
								(setting) =>
									setting && (
										<SideLink
											key={
												setting.displayName
											}
											href={setting.href}
										>
											{setting.icon}

											<span className='ml-3 mr-2'>
												{
													setting.displayName
												}
											</span>
										</SideLink>
									),
							)}
					</ul>

					<ul className='pt-5 mt-5 space-y-2 border-t border-gray-700'>
						<SideLink
							href='#'
							onClick={async () => {
								await logout();
								router.refresh();
							}}
						>
							<LogOut className='flex-shrink-0 w-6 h-6 transition duration-75  group-hover:text-white' />

							<span className='ml-3 mr-2'>
								تسجيل الخروج
							</span>
						</SideLink>
					</ul>
				</div>
			</aside>
		</>
	);
}

function SideLink(
	props: Omit<ComponentProps<typeof Link>, 'className'>,
) {
	const pathname = usePathname();

	return (
		<li>
			<Link
				{...props}
				className={cn(
					'flex items-center p-2 text-base font-normal rounded-lg transition duration-75 hover:text-white hover:bg-gray-700 group',
					pathname === props.href &&
						'bg-gray-700 text-white',
				)}
			/>
		</li>
	);
}
