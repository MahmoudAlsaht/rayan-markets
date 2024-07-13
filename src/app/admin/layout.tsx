import { ReactNode } from 'react';
import AdminNavbar from './_components/AdminNavbar';

export default function AdminLayout({
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
