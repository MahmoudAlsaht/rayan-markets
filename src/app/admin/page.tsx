import { checkUser } from '../(siteFacing)/auth/_actions/isAuthenticated';
import { SETTINGS } from './_components/AdminOptions';
import Widget from './_components/Widget';

export default async function AdminHome() {
	const user = await checkUser();

	return (
		<div
			className='h-dvh grid mt-4 sm:mt-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
			dir='rtl'
		>
			{SETTINGS.map((setting) =>
				setting.displayName !== 'المتجر' &&
				user?.role === 'admin' ? (
					<Widget
						key={setting.key}
						title={setting.displayName}
						href={setting.href}
					/>
				) : (
					setting.displayName !== 'المتجر' &&
					setting.displayName !== 'المستخدمين' && (
						<Widget
							key={setting.key}
							title={setting.displayName}
							href={setting.href}
						/>
					)
				),
			)}
			<div className='h-20'></div>
		</div>
	);
}
