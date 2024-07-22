import { isEditor } from '@/app/(siteFacing)/auth/_actions/isAdmin';
import { ReactNode } from 'react';

export default async function BrandsSettingsLayout({
	children,
}: {
	children: ReactNode;
}) {
	await isEditor();

	return <div>{children}</div>;
}
