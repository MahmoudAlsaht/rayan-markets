import BackButtonNav from '@/components/BackButtonNav';
import { getAllUsers } from './_actions/getAllUsers';
import UsersTable from './_components/UsersTable';

export default async function UsersSettingsPage() {
	const users = await getAllUsers();
	return (
		<main dir='rtl'>
			<BackButtonNav bg={false} />
			<h1 className='text-center text-4xl py-8'>
				إعدادات المستخدمين
			</h1>
			<UsersTable data={users} />
		</main>
	);
}
