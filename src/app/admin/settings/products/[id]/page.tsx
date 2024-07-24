import BackButtonNav from '@/components/BackButtonNav';
import PageHeader from '@/components/PageHeader';
import db from '@/db/db';
import { ProductForm } from '../_components/ProductForm';

export default async function EditProductPage({
	params: { id },
}: {
	params: { id: string };
}) {
	const product = await db.product.findUnique({
		where: { id },
		select: {
			id: true,
			category: {
				select: {
					id: true,
					name: true,
				},
			},
			brand: {
				select: {
					id: true,
					name: true,
				},
			},
			name: true,
			price: true,
			quantity: true,
			body: true,
			productType: true,
			description: true,
			isOffer: true,
			newPrice: true,
			offerStartsAt: true,
			offerEndsAt: true,
			weights: true,
			image: { select: { path: true } },
		},
	});

	const brands = await db.brand.findMany({
		select: { name: true, id: true },
	});

	const categories = await db.category.findMany({
		select: { name: true, id: true },
	});

	return (
		<main dir='rtl'>
			<BackButtonNav bg={false} />
			<PageHeader title={`تعديل ${product?.name}`} />

			<ProductForm
				product={product}
				categories={categories}
				brands={brands}
			/>
		</main>
	);
}
