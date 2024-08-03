import BackButtonNav from '@/components/BackButtonNav';
import db from '@/db/db';
import { cache } from '@/lib/cache';
import { ProductCard } from '../_components/ProductCard';
import { addHours } from 'date-fns';

const getProducts = cache(() => {
	db.product.updateMany({
		where: {
			offerEndsAt: {
				lt: addHours(new Date(), 3),
			},
		},
		data: {
			newPrice: null,
			isOffer: false,
			offerStartsAt: null,
			offerEndsAt: null,
		},
	});

	db.product.updateMany({
		where: {
			offerStartsAt: {
				gt: addHours(new Date(), 3),
			},
		},
		data: {
			isOffer: false,
		},
	});

	db.product.updateMany({
		where: {
			AND: [
				{
					offerStartsAt: {
						lte: addHours(new Date(), 3),
					},
				},
				{
					offerEndsAt: {
						gt: addHours(new Date(), 3),
					},
				},
			],
		},
		data: {
			isOffer: true,
		},
	});

	return db.product.findMany({
		select: {
			id: true,
			name: true,
			price: true,
			newPrice: true,
			image: {
				select: {
					path: true,
				},
			},
		},
	});
}, ['/products', 'getProducts']);

export default async function Products() {
	const products = await getProducts();

	return (
		<div dir='rtl' className='h-screen'>
			<div className='sm:hidden'>
				<BackButtonNav goHome />
			</div>
			<div className='overflow-auto md:p-4 rounded-t-[10px]'>
				<div className='grid grid-cols-2 md:grid-cols-4'>
					{products.map((product) => (
						<ProductCard
							key={product.id}
							{...product}
						/>
					))}
				</div>
			</div>
			<div className='h-20'></div>
		</div>
	);
}
