import { ReactNode } from 'react';
import MainNavbar from './_components/MainNavbar';
import BottomNavbar from './_components/BottomNavbar';
import { checkUser } from './auth/_actions/isAuthenticated';

export default async function SiteFacingLayout({
	children,
}: {
	children: ReactNode;
}) {
	const user = await checkUser();
	return (
		<div dir='rtl'>
			<MainNavbar user={user} />
			<BottomNavbar />
			{children}
		</div>
	);
}
