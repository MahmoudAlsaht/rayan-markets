import { ReactNode } from 'react';
import AdminNavbar from './_components/AdminNavbar';

export const dynamic = 'force-dynamic';

export default async function AdminLayout({
	children,
}: {
	children: ReactNode;
}) {
	return (
		<main dir='rtl'>
			<AdminNavbar />
			{children}
		</main>
	);
}
