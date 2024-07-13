import { Button } from '@/components/ui/button';
import {
	Card,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import Link from 'next/link';
import { MoveLeft } from 'lucide-react';

export default function Widget({
	title,
	href,
}: {
	title: string;
	href: string;
}) {
	return (
		<>
			<Card dir='rtl' className='border-none'>
				<CardHeader>
					<CardTitle className='text-rayanPrimary-dark'>
						{title}
					</CardTitle>
				</CardHeader>
				<CardFooter>
					<Button
						asChild
						className='text-rayanPrimary-dark hover:text-white hover:bg-rayanPrimary-dark'
						variant='outline'
					>
						<Link href={href}>
							انظر المزيد
							<MoveLeft className='mr-4' />
						</Link>
					</Button>
				</CardFooter>
			</Card>
		</>
	);
}
