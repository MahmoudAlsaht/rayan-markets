import BackButtonNav from '@/components/BackButtonNav';
import PageHeader from '@/components/PageHeader';
import db from '@/db/db';
import { CategoryForm } from '../_components/CategoryForm';

export default async function EditCategoryPage({
	params: { id },
}: {
	params: { id: string };
}) {
	const category = await db.category.findUnique({
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
			<PageHeader title={`تعديل ${category?.name}`} />

			<CategoryForm category={category} />
		</main>
	);
}
