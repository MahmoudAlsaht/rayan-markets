import { redirect } from 'next/navigation';
import { checkUser } from '../_actions/isAuthenticated';
import { RegisterForm } from './_components/RegisterForm';

export default async function RegisterPage() {
	const user = await checkUser();
	// if (user) redirect('/');
	return (
		<main dir='rtl'>
			<h1 className='text-center mt-16 text-4xl mb-4'>
				التسجيل
			</h1>
			<RegisterForm />
		</main>
	);
}
