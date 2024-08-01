import { formatCurrency } from '@/lib/formatters';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';

export function ProductCard(product: {
	id: string;
	name: string;
	price: number;
	newPrice: number | null;
	image: {
		path: string;
	} | null;
}) {
	return (
		<Card
			className='flex overflow-hidden flex-col'
			dir='rtl'
		>
			<div className='relative w-full h-auto aspect-video'>
				<Image
					src={product?.image?.path as string}
					fill
					alt={product.name as string}
					priority
					sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
				/>
			</div>
			<CardHeader>
				<CardTitle className='text-xs md:text-2xl'>
					{product.name}
				</CardTitle>
				<CardDescription className='text-xs md:text-xl'>
					{formatCurrency(
						product.newPrice
							? product.newPrice
							: product.price || 0 / 100,
					)}
				</CardDescription>
			</CardHeader>
			{/* <CardContent className="flex-grow">
        <p className="line-clamp-4">{description}</p>
      </CardContent> */}
			<CardFooter>
				<Button asChild size='sm' className='w-full'>
					<Link href={`#`}>اضف إلى السلة</Link>
				</Button>
			</CardFooter>
		</Card>
	);
}

export function ProductCardSkeleton() {
	return (
		<Card className='overflow-hidden flex flex-col animate-pulse'>
			<div className='w-full aspect-video bg-gray-300' />
			<CardHeader>
				<CardTitle>
					<div className='w-3/4 h-6 rounded-full bg-gray-300' />
				</CardTitle>
				<CardDescription>
					<div className='w-1/2 h-4 rounded-full bg-gray-300' />
				</CardDescription>
			</CardHeader>
			{/* <CardContent className='space-y-2'>
				<div className='w-full h-4 rounded-full bg-gray-300' />
				<div className='w-full h-4 rounded-full bg-gray-300' />
				<div className='w-3/4 h-4 rounded-full bg-gray-300' />
			</CardContent> */}
			<CardFooter>
				<Button
					className='w-full'
					disabled
					size='lg'
				></Button>
			</CardFooter>
		</Card>
	);
}
