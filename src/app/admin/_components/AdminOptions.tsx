import {
	Barcode,
	Columns3,
	Home,
	LayoutPanelTop,
	Locate,
	ShoppingBag,
	SlidersHorizontal,
	TicketCheck,
	Truck,
	Users,
} from 'lucide-react';
import { ReactNode } from 'react';

type TypeSettings = {
	displayName: string;
	href: string;
	icon: ReactNode;
};

export const SETTINGS: TypeSettings[] = [
	{
		displayName: 'المتجر',
		href: '/',
		icon: (
			<Home className='flex-shrink-0 w-6 h-6 transition duration-75  group-hover:text-white' />
		),
	},
	{
		displayName: 'المستخدمين',
		href: '/admin/settings/users',
		icon: (
			<Users className='flex-shrink-0 w-6 h-6 transition duration-75  group-hover:text-white' />
		),
	},
	{
		displayName: 'إعدادات الحساب',
		href: '/admin/settings/account-settings',
		icon: (
			<SlidersHorizontal className='flex-shrink-0 w-6 h-6 transition duration-75  group-hover:text-white' />
		),
	},
	{
		displayName: 'الأقسام',
		href: '/admin/settings/categories',
		icon: (
			<LayoutPanelTop className='flex-shrink-0 w-6 h-6 transition duration-75  group-hover:text-white' />
		),
	},
	{
		displayName: 'العلامات التجارية',
		href: '/admin/settings/brands',
		icon: (
			<ShoppingBag className='flex-shrink-0 w-6 h-6 transition duration-75  group-hover:text-white' />
		),
	},
	{
		displayName: 'المنتجات',
		href: '/admin/settings/products',
		icon: (
			<Barcode className='flex-shrink-0 w-6 h-6 transition duration-75  group-hover:text-white' />
		),
	},
	{
		displayName: 'كوبونات الخصم',
		href: '/admin/settings/promo-codes',
		icon: (
			<TicketCheck className='flex-shrink-0 w-6 h-6 transition duration-75  group-hover:text-white' />
		),
	},
	{
		displayName: 'اللافتات',
		href: '/admin/settings/banners',
		icon: (
			<Columns3 className='flex-shrink-0 w-6 h-6 transition duration-75  group-hover:text-white' />
		),
	},
	{
		displayName: 'المناطق المدعومة',
		href: '/admin/settings/districts',
		icon: (
			<Locate className='flex-shrink-0 w-6 h-6 transition duration-75  group-hover:text-white' />
		),
	},
	{
		displayName: 'الطلبات',
		href: '/admin/settings/orders',
		icon: (
			<Truck className='flex-shrink-0 w-6 h-6 transition duration-75  group-hover:text-white' />
		),
	},
];
