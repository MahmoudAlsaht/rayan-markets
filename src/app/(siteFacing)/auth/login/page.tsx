import { redirect } from 'next/navigation';
import { checkUser } from '../_actions/isAuthenticated';
import { LoginForm } from './_components/LoginForm';

export default async function LoginPage() {
	const user = await checkUser();
	if (user) redirect('/');
	return (
		<main dir='rtl'>
			<h1 className='text-center mt-16 text-4xl mb-4'>
				تسجيل الدخول
			</h1>
			<LoginForm />
		</main>
	);
}
