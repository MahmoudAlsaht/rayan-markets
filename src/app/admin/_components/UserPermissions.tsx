import { checkUser } from '@/app/(siteFacing)/auth/_actions/isAuthenticated';
import {
	Barcode,
	Columns3,
	Home,
	LayoutPanelTop,
	Locate,
	// ShoppingBag,
	SlidersHorizontal,
	TicketCheck,
	Truck,
	Users,
} from 'lucide-react';
import { ReactNode } from 'react';

export type Permission = {
	displayName: string;
	href: string;
	icon: ReactNode;
};

export type UserPermission = {
	admin: boolean;
	editor: boolean;
	staff: boolean;
	customer: boolean;
	unRegisteredUser: boolean;
	profile: string;
};

export const getUserPermission = async () => {
	const user = await checkUser();

	return {
		admin: user?.role === 'admin',
		editor: user?.role === 'editor',
		staff: user?.role === 'staff',
		customer: user?.role === 'customer',
		unRegisteredUser: user == null,
		profile: user?.profileId as string,
	};
};

export const authorizedUserPermissions = (profileId: string) =>
	[
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
			href: `/account/${profileId}/account-settings`,
			icon: (
				<SlidersHorizontal className='flex-shrink-0 w-6 h-6 transition duration-75  group-hover:text-white' />
			),
		},
		{
			displayName: 'الأقسام',
			href: '/admin/settings/sections',
			icon: (
				<LayoutPanelTop className='flex-shrink-0 w-6 h-6 transition duration-75  group-hover:text-white' />
			),
		},
		// {
		// 	displayName: 'العلامات التجارية',
		// 	href: '/admin/settings/brands',
		// 	icon: (
		// 		<ShoppingBag className='flex-shrink-0 w-6 h-6 transition duration-75  group-hover:text-white' />
		// 	),
		// },
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
	] as Permission[];

export const customerPermissions = (profileId: string) =>
	[
		{
			displayName: 'المتجر',
			href: '/',
			icon: (
				<Home className='flex-shrink-0 w-6 h-6 transition duration-75  group-hover:text-white' />
			),
		},
		{
			displayName: 'إعدادات الحساب',
			href: `/account/${profileId}/account-settings`,
			icon: (
				<SlidersHorizontal className='flex-shrink-0 w-6 h-6 transition duration-75  group-hover:text-white' />
			),
		},
		{
			displayName: 'عناويني',
			href: `/account/${profileId}/contacts`,
			icon: (
				<Locate className='flex-shrink-0 w-6 h-6 transition duration-75  group-hover:text-white' />
			),
		},
		{
			displayName: 'الطلبات',
			href: `/account/${profileId}/orders`,
			icon: (
				<Truck className='flex-shrink-0 w-6 h-6 transition duration-75  group-hover:text-white' />
			),
		},
	] as Permission[];

export const adminPermissions = (profileId: string) =>
	authorizedUserPermissions(profileId).map((setting) => {
		return setting.displayName !== 'المتجر' ? setting : null;
	});

export const editorPermissions = (profileId: string) =>
	adminPermissions(profileId).map((setting) => {
		return setting?.displayName !== 'المستخدمين'
			? setting
			: null;
	});

export const staffPermissions = (profileId: string) =>
	authorizedUserPermissions(profileId).map((setting) => {
		return setting.displayName === 'إعدادات الحساب' ||
			setting.displayName === 'الطلبات'
			? setting
			: null;
	});
