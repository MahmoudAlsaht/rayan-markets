import { redirect } from 'next/navigation';
import { checkUser } from '../_actions/isAuthenticated';
import { RegisterForm } from './_components/RegisterForm';
import BackButtonNav from '@/components/BackButtonNav';

export default async function RegisterPage() {
	const user = await checkUser();
	if (user) redirect('/');
	return (
		<main dir='rtl'>
			<BackButtonNav bg={false} />
			<h1 className='text-center mt-16 text-4xl mb-4'>
				التسجيل
			</h1>
			<RegisterForm />
		</main>
	);
}
