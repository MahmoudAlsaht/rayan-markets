import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import localFont from 'next/font/local';
import InstallApp from '../components/InstallApp';

const inter = Inter({ subsets: ['latin'] });

const myFont = localFont({
	src: '../fonts/Alexandria-VariableFont_wght.ttf',
	display: 'swap',
});
import './globals.css';

const APP_NAME = 'أسواق الريان';
const APP_DEFAULT_TITLE = 'أسواق الريان العالمية';
const APP_TITLE_TEMPLATE = '%s - أسواق الريان';
const APP_DESCRIPTION =
	'أسواق الريان العالمية تجسد روح الكفاءة والابتكار والتركيز على العملاء';

export const metadata: Metadata = {
	manifest: '/manifest.json',
	applicationName: APP_NAME,
	title: {
		default: APP_DEFAULT_TITLE,
		template: APP_TITLE_TEMPLATE,
	},
	description: APP_DESCRIPTION,

	appleWebApp: {
		capable: true,
		statusBarStyle: 'default',
		title: APP_DEFAULT_TITLE,
		startupImage: ['/apple-touch-icon.png'],
	},
	formatDetection: {
		telephone: false,
	},
	openGraph: {
		type: 'website',
		siteName: APP_NAME,
		title: {
			default: APP_DEFAULT_TITLE,
			template: APP_TITLE_TEMPLATE,
		},
		description: APP_DESCRIPTION,
	},
	twitter: {
		card: 'summary',
		title: {
			default: APP_DEFAULT_TITLE,
			template: APP_TITLE_TEMPLATE,
		},
		description: APP_DESCRIPTION,
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='ar' className={myFont.className}>
			<body className={inter.className}>
				<InstallApp />
				{children}
			</body>
		</html>
	);
}
