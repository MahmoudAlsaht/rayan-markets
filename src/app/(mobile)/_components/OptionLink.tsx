import { ComponentProps } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export function OptionLink(
	props: Omit<ComponentProps<typeof Link>, 'className'>,
) {
	return (
		<Link
			{...props}
			className={cn(
				'flex px-4 py-3 hover:bg-rayanPrimary-light hover:text-black',
			)}
		/>
	);
}
