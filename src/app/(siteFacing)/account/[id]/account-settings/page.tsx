import Widget from '@/app/admin/_components/Widget';
import BackButtonNav from '@/components/BackButtonNav';
import PageHeader from '@/components/PageHeader';

const accountSettings = (id: string) => [
	{
		displayName: 'اسم المستخدم',
		href: `/account/${id}/account-settings/username`,
	},
	{
		displayName: 'الهاتف',
		href: `/account/${id}/account-settings/phone`,
	},
	{
		displayName: 'كلمة المرور',
		href: `/account/${id}/account-settings/password`,
	},
	{
		displayName: 'حذف الحساب',
		href: `/account/${id}/account-settings/account-deletion`,
	},
];

export default function AccountSettings({
	params: { id },
}: {
	params: { id: string };
}) {
	return (
		<main dir='rtl'>
			<BackButtonNav bg={false} />
			<PageHeader title='إعدادات الحساب' />

			<div className='h-dvh grid mt-4 sm:mt-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
				{accountSettings(id || 'unRegisteredUser').map(
					(setting) =>
						setting &&
						setting.displayName !== 'المتجر' && (
							<Widget
								key={setting.displayName}
								title={setting.displayName}
								href={setting.href}
								danger={
									setting.displayName ===
									'حذف الحساب'
								}
							/>
						),
				)}
				<div className='h-20'></div>;
			</div>
		</main>
	);
}
