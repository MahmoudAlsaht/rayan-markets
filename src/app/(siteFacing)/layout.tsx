import { ReactNode } from 'react';
import MainNavbar from './_components/MainNavbar';
import BottomNavbar from './_components/BottomNavbar';
import { checkUser } from './auth/_actions/isAuthenticated';
import logout from './auth/_actions/logout';

export default async function AuthLayout({
	children,
}: {
	children: ReactNode;
}) {
	const user = await checkUser();
	const handleLogout = logout;
	return (
		<div dir='rtl'>
			<MainNavbar user={user} logout={handleLogout} />
			<BottomNavbar />
			{children}
		</div>
	);
}
