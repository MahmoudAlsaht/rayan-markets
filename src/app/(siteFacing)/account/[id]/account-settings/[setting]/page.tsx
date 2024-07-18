import BackButtonNav from '@/components/BackButtonNav';
import UsernameForm from '../_components/UsernameForm';
import PhoneForm from '../_components/PhoneForm';
import PasswordForm from '../_components/PasswordForm';
import DeleteAccountForm from '../_components/DeleteAccountForm';
import { checkUser } from '@/app/(siteFacing)/auth/_actions/isAuthenticated';

export default async function page({
	params: { id, setting },
}: {
	params: { id: string; setting: string };
}) {
	const user = await checkUser();

	return (
		<div dir='rtl'>
			<BackButtonNav bg={false} />
			{setting === 'username' && (
				<UsernameForm
					username={user?.username as string}
					profileId={id}
				/>
			)}
			{setting === 'phone' && (
				<PhoneForm
					phone={user?.phone as string}
					profileId={id}
				/>
			)}
			{setting === 'password' && (
				<PasswordForm profileId={id} />
			)}
			{setting === 'account-deletion' && (
				<DeleteAccountForm profileId={id} />
			)}
		</div>
	);
}
