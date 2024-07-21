import BackButtonNav from '@/components/BackButtonNav';
import PageHeader from '@/components/PageHeader';
import { CategoryForm } from '../new/_components/CategoryForm';
import db from '@/db/db';

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
