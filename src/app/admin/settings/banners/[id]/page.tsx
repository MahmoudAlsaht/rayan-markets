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
			bannerType: true,
			images: { select: { path: true, id: true } },
		},
	});

	return (
		<main dir='rtl'>
			<BackButtonNav bg={false} />
			<PageHeader
				title={
					banner?.bannerType === 'offers'
						? 'تعديل لافتة العروض'
						: 'تعديل اللافتة الرئيسية'
				}
			/>

			<BannerForm banner={banner} />
		</main>
	);
}
