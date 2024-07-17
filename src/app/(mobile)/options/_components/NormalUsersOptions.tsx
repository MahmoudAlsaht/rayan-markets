'use client';
import { OptionLink } from '../../_components/OptionLink';
import { User } from '@prisma/client';
import { USER_SETTINGS } from '@/app/(siteFacing)/account/_components/UserOptions';

export default function NormalUsersOptions({
	user,
}: {
	user: Partial<User>;
}) {
	return (
		<>
			{USER_SETTINGS.map(
				(setting) =>
					setting.displayName !== 'المتجر' && (
						<OptionLink
							key={setting.displayName}
							href={setting.href}
							icon={setting.icon}
							displayName={setting.displayName}
						/>
					),
			)}
		</>
	);
}
