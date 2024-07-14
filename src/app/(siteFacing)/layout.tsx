import { ReactNode } from 'react';
import MainNavbar from './_components/MainNavbar';
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
			{children}
		</div>
	);
}
