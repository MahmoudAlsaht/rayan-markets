import { ReactNode } from 'react';
import AdminNavbar from './_components/AdminNavbar';
import { isAuthorizedUser } from '../(siteFacing)/auth/_actions/isAdmin';

export const dynamic = 'force-dynamic';

export default async function AdminLayout({
	children,
}: {
	children: ReactNode;
}) {
	await isAuthorizedUser();
	return (
		<main dir='rtl' className='h-full bg-slate-50'>
			<div className='hidden sm:block'>
				<AdminNavbar />
			</div>

			{children}
		</main>
	);
}
