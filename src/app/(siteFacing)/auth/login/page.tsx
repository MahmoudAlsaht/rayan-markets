import { redirect } from 'next/navigation';
import { checkUser } from '../_actions/isAuthenticated';
import { LoginForm } from './_components/LoginForm';
import BackButtonNav from '@/components/BackButtonNav';
import PageHeader from '@/components/PageHeader';

export default async function LoginPage() {
	const user = await checkUser();
	if (user) redirect('/');
	return (
		<main dir='rtl'>
			<BackButtonNav bg={false} />
			<PageHeader title='تسجيل الدخول' />
			<LoginForm />
		</main>
	);
}
