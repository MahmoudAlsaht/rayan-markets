import { SETTINGS } from './_components/AdminOptions';
import Widget from './_components/Widget';

export default function AdminHome() {
	return (
		<div
			className='grid mt-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
			dir='rtl'
		>
			{SETTINGS.map((setting) => (
				<Widget
					key={setting.displayName}
					title={setting.displayName}
					href={setting.href}
				/>
			))}
		</div>
	);
}
