'use client';

import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useFormStatus } from 'react-dom';

export default function SubmitButton({
	body,
	handleClick,
	className,
	destructive,
}: {
	body: string;
	handleClick?: () => void;
	className?: string;
	destructive?: boolean;
}) {
	const { pending } = useFormStatus();

	return (
		<Button
			variant={destructive ? 'destructive' : 'default'}
			className={`w-full ${className}`}
			type='submit'
			disabled={pending}
			onClick={() => handleClick && handleClick()}
		>
			{pending ? (
				<Loader2 className='animate-spin text-rayanPrimary-dark dark:text-rayanPrimary-light' />
			) : (
				body
			)}
		</Button>
	);
}
