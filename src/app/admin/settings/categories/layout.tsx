import { isEditor } from '@/app/(siteFacing)/auth/_actions/isAdmin';
import { ReactNode } from 'react';

export default async function CategoriesSettingsLayout({
	children,
}: {
	children: ReactNode;
}) {
	await isEditor();

	return <div>{children}</div>;
}
