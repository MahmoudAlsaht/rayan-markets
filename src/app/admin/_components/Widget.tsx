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
			<Card dir='rtl'>
				<CardHeader>
					<CardTitle>{title}</CardTitle>
				</CardHeader>
				<CardFooter>
					<Button asChild>
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
