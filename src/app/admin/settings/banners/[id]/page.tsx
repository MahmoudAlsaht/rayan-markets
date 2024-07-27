import BackButtonNav from '@/components/BackButtonNav';
import PageHeader from '@/components/PageHeader';
import db from '@/db/db';
import { BannerForm } from '../_components/BannerForm';

export default async function EditBannerPage({
	params: { id },
}: {
	params: { id: string };
}) {
	const banner = await db.banner.findUnique({
		where: { id },
		select: {
			id: true,
			name: true,
			bannerType: true,
			images: { select: { path: true, id: true } },
			category: { select: { id: true, name: true } },
			brand: { select: { id: true, name: true } },
		},
	});

	return (
		<main dir='rtl'>
			<BackButtonNav bg={false} />
			<PageHeader title={`تعديل ${banner?.name}`} />

			<BannerForm banner={banner} />
		</main>
	);
}
