import { ReactNode } from 'react';
import AdminNavbar from './_components/AdminNavbar';
import { isAdmin } from '../(siteFacing)/auth/_actions/isAdmin';

export const dynamic = 'force-dynamic';

export default async function AdminLayout({
	children,
}: {
	children: ReactNode;
}) {
	await isAdmin();
	return (
		<main dir='rtl'>
			<AdminNavbar />
			{children}
		</main>
	);
}
