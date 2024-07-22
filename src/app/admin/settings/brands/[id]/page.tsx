import BackButtonNav from '@/components/BackButtonNav';
import PageHeader from '@/components/PageHeader';
import db from '@/db/db';
import { BrandForm } from '../_components/BrandForm';

export default async function EditBrandPage({
	params: { id },
}: {
	params: { id: string };
}) {
	const brand = await db.brand.findUnique({
		where: { id },
		select: {
			id: true,
			name: true,
			image: { select: { path: true } },
			banner: {
				select: {
					images: {
						select: { id: true, path: true },
					},
				},
			},
		},
	});

	return (
		<main dir='rtl'>
			<BackButtonNav bg={false} />
			<PageHeader title={`تعديل ${brand?.name}`} />

			<BrandForm brand={brand} />
		</main>
	);
}
