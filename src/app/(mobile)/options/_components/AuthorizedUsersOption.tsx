'use client';
import { SETTINGS } from '@/app/admin/_components/AdminOptions';
import { OptionLink } from '../../_components/OptionLink';
import { User } from '@prisma/client';

export default function AuthorizedUsersOption({
	user,
}: {
	user: Partial<User>;
}) {
	const adminSettings = SETTINGS.map((setting) => {
		return setting.displayName !== 'المتجر' ? setting : null;
	});

	const editorSettings = adminSettings.map((setting) => {
		return setting?.displayName !== 'المستخدمين'
			? setting
			: null;
	});

	const staffSettings = SETTINGS.map((setting) => {
		return setting.displayName === 'إعدادات الحساب' ||
			setting.displayName === 'الطلبات'
			? setting
			: null;
	});

	return (
		<>
			{user.role === 'admin' &&
				adminSettings?.map(
					(setting) =>
						setting && (
							<OptionLink
								icon={setting.icon}
								key={setting.displayName}
								href={setting.href}
								displayName={setting.displayName}
							/>
						),
				)}

			{user.role === 'editor' &&
				editorSettings?.map(
					(setting) =>
						setting && (
							<OptionLink
								icon={setting.icon}
								key={setting.displayName}
								href={setting.href}
								displayName={setting.displayName}
							/>
						),
				)}

			{user.role === 'staff' &&
				staffSettings?.map(
					(setting) =>
						setting && (
							<OptionLink
								icon={setting.icon}
								key={setting.displayName}
								href={setting.href}
								displayName={setting.displayName}
							/>
						),
				)}
		</>
	);
}
