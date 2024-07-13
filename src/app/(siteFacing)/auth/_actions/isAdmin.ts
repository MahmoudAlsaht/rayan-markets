import { redirect } from 'next/navigation';
import { checkUser } from './isAuthenticated';

export const isAdmin = async () => {
	const user = await checkUser();

	if (user == null) redirect('/');
	if (user.role === 'customer') redirect('/');

	return user;
};
