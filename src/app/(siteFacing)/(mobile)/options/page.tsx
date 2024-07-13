import MobileNav from '../_components/MobileNav';
import { checkUser } from '../../auth/_actions/isAuthenticated';
import { OptionLink } from '../_components/OptionLink';
import NormalUsersOptions from '../_components/NormalUsersOptions';
import AuthorizedUsersOption from '../_components/AuthorizedUsersOption';

export default async function OptionsPage() {
	const user = await checkUser();

	return (
		<main dir='rtl' className='sm:hidden'>
			<MobileNav />
			<div className='flex flex-col mx-4 w-full h-screen text-2xl text-rayanPrimary-dark bg-inherit'>
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
	);
}
