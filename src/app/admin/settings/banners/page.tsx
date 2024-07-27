import BackButtonNav from '@/components/BackButtonNav';
import PageHeader from '@/components/PageHeader';
import { getAllBanners } from './_actions/getAllBanners';
import BannersTable from './_components/BannersTable';

export default async function BannersSettingsPage() {
	const banners = await getAllBanners();

	return (
		<main dir='rtl'>
			<BackButtonNav bg={false} href='/admin' />
			<PageHeader title='إعدادات اللافتات' />

			<BannersTable data={banners} />
		</main>
	);
}
