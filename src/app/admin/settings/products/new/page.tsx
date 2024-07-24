import BackButtonNav from '@/components/BackButtonNav';
import PageHeader from '@/components/PageHeader';
import { ProductForm } from '../_components/ProductForm';
import db from '@/db/db';

export default async function NewProduct() {
	const brands = await db.brand.findMany({
		select: { name: true, id: true },
	});

	const categories = await db.category.findMany({
		select: { name: true, id: true },
	});

	return (
		<main dir='rtl'>
			<BackButtonNav bg={false} />
			<PageHeader title='إضافة منتج' />

			<ProductForm
				brands={brands}
				categories={categories}
			/>
		</main>
	);
}
