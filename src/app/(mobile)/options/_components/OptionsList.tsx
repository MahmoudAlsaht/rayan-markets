'use client';
import { OptionLink } from '../../_components/OptionLink';
import NormalUsersOptions from './NormalUsersOptions';
import AuthorizedUsersOption from './AuthorizedUsersOption';
import { LogInIcon, UserPlus } from 'lucide-react';
import logout from '@/app/(siteFacing)/auth/_actions/logout';
import { LogOut } from 'lucide-react';
import { UserPermission } from '@/app/admin/_components/UserPermissions';

export default function OptionsList({
	admin,
	editor,
	customer,
	staff,
	unRegisteredUser,
	profile,
}: UserPermission) {
	return (
		<>
			<div className='flex flex-col w-full h-screen text-2xl text-rayanPrimary-dark bg-inherit'>
				{unRegisteredUser && (
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

				{customer && (
					<NormalUsersOptions profile={profile} />
				)}

				{!customer && (
					<AuthorizedUsersOption
						admin={admin}
						editor={editor}
						staff={staff}
						profile={profile}
					/>
				)}

				{!unRegisteredUser && (
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
