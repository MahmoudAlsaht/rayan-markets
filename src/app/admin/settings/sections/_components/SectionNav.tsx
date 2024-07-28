'use client';
import { Tabs, TabsList } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { ComponentProps } from 'react';

export default function SectionNav() {
	const pathname = usePathname();

	return (
		(pathname === '/admin/settings/sections' ||
			pathname === '/admin/settings/sections/categories' ||
			pathname === '/admin/settings/sections/brands') && (
			<Tabs className='flex flex-row-reverse justify-center'>
				<TabsList>
					<TabLink href='/admin/settings/sections/brands'>
						العلامات التجارية
					</TabLink>
					<TabLink href='/admin/settings/sections/categories'>
						الفئات
					</TabLink>
					<TabLink href='/admin/settings/sections'>
						كل الأقسام
					</TabLink>
				</TabsList>
			</Tabs>
		)
	);
}

function TabLink(
	props: Omit<ComponentProps<typeof Link>, 'className'>,
) {
	const pathname = usePathname();
	return (
		<Link
			{...props}
			className={cn(
				'inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
				pathname === props.href &&
					'bg-background text-foreground shadow-sm',
			)}
		/>
	);
}
