import BackButtonNav from '../../../components/BackButtonNav';
import { OptionLink } from '../_components/OptionLink';
import NormalUsersOptions from '../_components/NormalUsersOptions';
import AuthorizedUsersOption from '../_components/AuthorizedUsersOption';
import { checkUser } from '@/app/(siteFacing)/auth/_actions/isAuthenticated';

export default async function OptionsPage() {
	const user = await checkUser();

	return (
		<>
			<BackButtonNav />
			<main dir='rtl' className='sm:hidden'>
				<div className='flex flex-col w-full h-screen text-2xl text-rayanPrimary-dark bg-inherit'>
					{!user && (
						<>
							<OptionLink href='/auth/register'>
								التسجيل
							</OptionLink>
							<OptionLink href='/auth/login'>
								تسجيل الدخول
							</OptionLink>
						</>
					)}

					{user && user?.role === 'customer' && (
						<NormalUsersOptions user={user} />
					)}

					{user && user?.role !== 'customer' && (
						<AuthorizedUsersOption user={user} />
					)}
				</div>
			</main>
		</>
	);
}
