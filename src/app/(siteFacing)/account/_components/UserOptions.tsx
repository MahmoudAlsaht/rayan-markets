import { TypeSettings } from '@/app/admin/_components/AdminOptions';
import {
	Home,
	Locate,
	SlidersHorizontal,
	Truck,
} from 'lucide-react';
import { ReactNode } from 'react';

export const USER_SETTINGS: TypeSettings[] = [
	{
		displayName: 'المتجر',
		href: '/',
		icon: (
			<Home className='flex-shrink-0 w-6 h-6 transition duration-75  group-hover:text-white' />
		),
	},
	{
		displayName: 'إعدادات الحساب',
		href: '/account/account-settings',
		icon: (
			<SlidersHorizontal className='flex-shrink-0 w-6 h-6 transition duration-75  group-hover:text-white' />
		),
	},
	{
		displayName: 'عناويني',
		href: '/account/contacts',
		icon: (
			<Locate className='flex-shrink-0 w-6 h-6 transition duration-75  group-hover:text-white' />
		),
	},
	{
		displayName: 'الطلبات',
		href: '/account/orders',
		icon: (
			<Truck className='flex-shrink-0 w-6 h-6 transition duration-75  group-hover:text-white' />
		),
	},
];
