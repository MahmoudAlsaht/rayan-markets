import db from '@/db/db';
import { cache } from '@/lib/cache';
import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';
import { checkUser } from '../auth/_actions/isAuthenticated';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import ImageCarousel from './ImageCarousel';

const getBanner = cache(
	(type: string) => {
		return db.banner.findUnique({
			where: { bannerType: type },
			select: {
				id: true,
				images: {
					select: {
						bannerId: true,
						id: true,
						path: true,
						link: true,
					},
				},
			},
		});
	},
	['/', 'getBanner'],
);

export default function Banner({
	type,
	sectionBanners,
	sectionId,
}: {
	type: string;
	sectionId?: string;
	sectionBanners?: {
		id: string;
		path: string;
		link: string;
	}[];
}) {
	return (
		<Suspense
			fallback={
				<Skeleton className='w-full max-w-[1481.6px] h-44 sm:h-56 md:h-72 rounded-xl' />
			}
		>
			<BannerSuspense
				type={type}
				sectionBanners={sectionBanners}
				sectionId={sectionId}
			/>
		</Suspense>
	);
}

async function BannerSuspense({
	type,
	sectionBanners,
	sectionId,
}: {
	type: string;
	sectionId?: string;
	sectionBanners?: {
		id: string;
		path: string;
		link: string;
	}[];
}) {
	const user = await checkUser();

	const banner =
		(type === 'main' || type === 'offers') &&
		(await getBanner(type));

	const images = banner ? banner?.images : sectionBanners;

	return (
		images && (
			<div className=''>
				{user &&
					(user.role === 'admin' ||
						user.role === 'editor') && (
						<Link
							href={`/admin/settings/${
								!banner
									? `sections/${sectionId}`
									: `banners/${banner.id}`
							}`}
							target='_blank'
						>
							<Button className='w-full'>
								{type === 'offers' ||
								type === 'main'
									? 'تعديل اللافتة'
									: 'تعديل القسم'}
							</Button>
						</Link>
					)}
				{images.length > 1 ? (
					<ImageCarousel
						images={images.map((image) => ({
							id: image.id,
							path: image.path,
							link: image.link,
						}))}
					/>
				) : (
					<Link href={images[0].link || '#'}>
						<div className='relative w-full max-w-[1481.6px] mx-auto h-44 sm:h-56 md:h-72'>
							<Image
								fill
								alt={`banner's image`}
								src={images[0].path}
								className='mx-auto cursor-pointer'
								priority
							/>
						</div>
					</Link>
				)}
			</div>
		)
	);
}
