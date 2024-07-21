/** @type {import('next').NextConfig} */
import withPWAInit from '@ducanh2912/next-pwa';
import { hostname } from 'os';
import path from 'path';

const withPWA = withPWAInit({
	dest: 'public',
	cacheOnFrontEndNav: true,
	aggressiveFrontEndNavCaching: true,
	reloadOnOnline: true,
	swcMinify: true,
	disable: process.env.NODE_ENV !== 'production' && true,
	workboxOptions: {
		disableDevLogs: true,
	},
});

const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: '**cloudinary.com',
			},
		],
	},
};

export default withPWA(nextConfig);
