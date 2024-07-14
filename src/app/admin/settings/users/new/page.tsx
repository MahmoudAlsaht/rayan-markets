import BackButtonNav from '@/components/BackButtonNav';
import { NewUserForm } from './_components/NewUserForm';

export default function NewUser() {
	return (
		<main dir='rtl'>
			<BackButtonNav bg={false} />
			<h1 className='text-center text-4xl py-8'>
				إضافة مستخدم جديد
			</h1>

			<NewUserForm />
		</main>
	);
}
