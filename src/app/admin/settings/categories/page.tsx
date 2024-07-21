import BackButtonNav from '@/components/BackButtonNav';
import PageHeader from '@/components/PageHeader';
import { getAllCategories } from './_actions/getAllCategories';
import CategoriesTable from './_components/CategoriesTable';

export default async function CategoriesSettingsPage() {
	const categories = await getAllCategories();

	return (
		<main dir='rtl'>
			<BackButtonNav bg={false} href='/admin' />
			<PageHeader title='إعدادات الأقسام' />

			<CategoriesTable data={categories} />
		</main>
	);
}
