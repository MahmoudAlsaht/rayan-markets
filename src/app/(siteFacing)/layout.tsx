import { ReactNode } from 'react';
import MainNavbar from './_components/MainNavbar';
import BottomNavbar from './_components/BottomNavbar';

export default function AuthLayout({
	children,
}: {
	children: ReactNode;
}) {
	return (
		<div dir='rtl'>
			<MainNavbar />
			<BottomNavbar />
			{children}
		</div>
	);
}
