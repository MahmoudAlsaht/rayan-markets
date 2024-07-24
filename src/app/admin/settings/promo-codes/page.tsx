import BackButtonNav from '@/components/BackButtonNav';
import PageHeader from '@/components/PageHeader';
import { getAllPromos } from './_actions/getAllPromos';
import PromosTable from './_components/PromosTable';

export default async function CategoriesSettingsPage() {
	const brands = await getAllPromos();

	return (
		<main dir='rtl'>
			<BackButtonNav bg={false} href='/admin' />
			<PageHeader title='إعدادات كوبونات الخصم' />

			<PromosTable data={brands} />
		</main>
	);
}
