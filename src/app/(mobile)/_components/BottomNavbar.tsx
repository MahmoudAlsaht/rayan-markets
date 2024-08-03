import { CiDeliveryTruck } from 'react-icons/ci';
import { SlOptions } from 'react-icons/sl';
import BottomNavLink from './BottomNavLink';
import { ImHome } from 'react-icons/im';
import SearchProducts from '@/app/(siteFacing)/_components/SearchProducts';
import db from '@/db/db';
import { addHours } from 'date-fns';
import { cache } from '@/lib/cache';
import { TProduct } from '@/app/(siteFacing)/_actions/product';

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

export default async function BottomNavbar() {
	const products = await getProducts();

	return (
		<div className='fixed z-50 w-full h-16 max-w-lg -translate-x-1/2 bg-rayanPrimary-dark text-white border border-gray-100 rounded-full bottom-4 left-1/2'>
			<div className='grid h-full max-w-lg grid-cols-4 mx-auto'>
				<BottomNavLink
					href='/'
					title='الرئيسية'
					icon={<ImHome className='size-7' />}
				/>

				<BottomNavLink
					title={
						<SearchProducts
							allProducts={products as TProduct[]}
						/>
					}
				/>

				<BottomNavLink
					href='/orders'
					icon={<CiDeliveryTruck className='size-8' />}
					title='طلباتي'
				/>

				<BottomNavLink
					href='/options'
					icon={<SlOptions className='size-8' />}
					title='الخيارات'
				/>
			</div>
		</div>
	);
}
