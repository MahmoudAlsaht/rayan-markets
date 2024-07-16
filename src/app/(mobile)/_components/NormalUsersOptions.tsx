'use client';
import { OptionLink } from './OptionLink';
import { User } from '@prisma/client';
import { useRouter } from 'next/navigation';
import logout from '@/app/(siteFacing)/auth/_actions/logout';
import { USER_SETTINGS } from '@/app/(siteFacing)/account/_components/UserOptions';
import { LogOut } from 'lucide-react';

export default function NormalUsersOptions({
	user,
}: {
	user: Partial<User>;
}) {
	const router = useRouter();

	return (
		<>
			{USER_SETTINGS.map(
				(setting) =>
					setting.displayName !== 'المتجر' && (
						<OptionLink
							key={setting.displayName}
							href={setting.href}
						>
							<span className='ml-4'>
								{setting.icon}
							</span>

							{setting.displayName}
						</OptionLink>
					),
			)}
			<OptionLink
				href='#'
				onClick={async () => {
					await logout();
					router.refresh();
				}}
			>
				<span className='ml-4'>
					<LogOut />
				</span>
				تسجيل الخروج
			</OptionLink>
		</>
	);
}
