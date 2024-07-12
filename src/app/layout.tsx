import type { Metadata } from 'next';
import localFont from 'next/font/local';
import InstallApp from '../components/InstallApp';
import './globals.css';
import { cn } from '@/lib/utils';
import { ThemeProvider } from 'next-themes';

const Alexandria = localFont({
	src: '../fonts/Alexandria-VariableFont_wght.ttf',
	display: 'swap',
});

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
		<html lang='ar' suppressHydrationWarning>
			<body
				className={cn(
					'text-rayanPrimary-dark dark:bg-slate-300 bg-slate-50 min-h-screen antialiased',
					Alexandria.className,
				)}
			>
				<ThemeProvider attribute='class'>
					<InstallApp />
					{children}
				</ThemeProvider>
			</body>
		</html>
	);
}
