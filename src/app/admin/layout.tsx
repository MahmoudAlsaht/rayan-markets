import { ReactNode } from 'react';
import AdminNavbar from './_components/AdminNavbar';
import { isAdmin } from '../(siteFacing)/auth/_actions/isAdmin';
import BottomNavbar from '../(mobile)/_components/BottomNavbar';

export const dynamic = 'force-dynamic';

export default async function AdminLayout({
	children,
}: {
	children: ReactNode;
}) {
	await isAdmin();
	return (
		<main dir='rtl' className='h-full bg-slate-50'>
			<div className='hidden sm:block'>
				<AdminNavbar />
			</div>

			{children}
		</main>
	);
}
