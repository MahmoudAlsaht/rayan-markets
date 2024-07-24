import BackButtonNav from '@/components/BackButtonNav';
import PageHeader from '@/components/PageHeader';
import { getAllBrands } from './_actions/getAllBrands';
import BrandsTable from './_components/BrandsTable';

export default async function BrandsSettingsPage() {
	const brands = await getAllBrands();

	return (
		<main dir='rtl'>
			<BackButtonNav bg={false} href='/admin' />
			<PageHeader title='إعدادات العلامات التجارية' />

			<BrandsTable data={brands} />
		</main>
	);
}
