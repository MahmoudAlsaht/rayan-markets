'use client';
import { User } from '@prisma/client';
import { OptionLink } from '../../_components/OptionLink';
import NormalUsersOptions from './NormalUsersOptions';
import AuthorizedUsersOption from './AuthorizedUsersOption';
import { LogInIcon, UserPlus } from 'lucide-react';
import logout from '@/app/(siteFacing)/auth/_actions/logout';
import { LogOut } from 'lucide-react';

export default function OptionsList({
	user,
}: {
	user: Partial<User> | null;
}) {
	return (
		<>
			<div className='flex flex-col w-full h-screen text-2xl text-rayanPrimary-dark bg-inherit'>
				{!user && (
					<>
						<OptionLink
							href='/auth/register'
							displayName='التسجيل'
							icon={<UserPlus />}
						/>
						<OptionLink
							href='/auth/login'
							displayName='تسجيل الدخول'
							icon={<LogInIcon />}
						/>
					</>
				)}

				{user && user?.role === 'customer' && (
					<NormalUsersOptions user={user} />
				)}

				{user && user?.role !== 'customer' && (
					<AuthorizedUsersOption user={user} />
				)}

				{user && (
					<OptionLink
						href='#'
						handleClick={logout}
						icon={<LogOut />}
						displayName='تسجيل الخروج'
					/>
				)}
			</div>
		</>
	);
}
