'use client';
import { OptionLink } from './OptionLink';
import { User } from '@prisma/client';
import { useRouter } from 'next/navigation';
import logout from '@/app/(siteFacing)/auth/_actions/logout';
import { USER_SETTINGS } from '@/app/(siteFacing)/account/_components/UserOptions';

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
				تسجيل الخروج
			</OptionLink>
		</>
	);
}
