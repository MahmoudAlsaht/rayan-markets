import { getAllUsers } from './_actions/getAllUsers';
import UsersTable from './_components/UsersTable';

export default async function UsersSettingsPage() {
	const users = await getAllUsers();
	return (
		<main dir='rtl'>
			<h1 className='text-center text-4xl py-8'>
				إعدادات المستخدمين
			</h1>
			<UsersTable data={users} />
		</main>
	);
}
