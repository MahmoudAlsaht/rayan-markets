import Image from 'next/image';
import Link from 'next/link';
import Logo from '../../rayan.marketLogo.png';
import AdminSideBar from './AdminSideBar';
import logout from '@/app/(siteFacing)/auth/_actions/logout';

export default function AdminNavbar() {
	const handleLogout = logout;

	return (
		<>
			<nav
				className='border-gray-200 dark:bg-white'
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

					<AdminSideBar logout={handleLogout} />
				</div>
			</nav>
		</>
	);
}
