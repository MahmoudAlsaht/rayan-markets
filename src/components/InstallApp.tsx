'use client';

import {
	SyntheticEvent,
	useLayoutEffect,
	useState,
} from 'react';
import { DownloadIcon, X } from 'lucide-react';

const InstallPWA = () => {
	const [supportsPWA, setSupportsPWA] = useState(false);
	const [promptInstall, setPromptInstall] =
		useState<any>(null);

	const [isInstalled, setIsInstalled] = useState(() => {
		if (typeof window !== 'undefined')
			return (
				localStorage.getItem('pwaInstalled') === '1' ||
				false
			);
	});

	const [open, setOpen] = useState(!isInstalled);

	const handleClose = (
		event: SyntheticEvent | Event,
		reason?: string,
	) => {
		if (reason === 'clickaway') {
			return;
		}

		setOpen(false);
	};

	useLayoutEffect(() => {
		const installHandler = (e: any) => {
			localStorage.setItem('pwaInstalled', '0');
			setIsInstalled(false);
			setSupportsPWA(true);
			setPromptInstall(e);
		};

		const afterInstalledHandler = () => {
			localStorage.setItem('pwaInstalled', '1');
			setIsInstalled(true);
		};

		if (typeof window !== 'undefined') {
			// General check for other platforms
			if (
				window.matchMedia('(display-mode: standalone)')
					.matches ||
				document.referrer.startsWith('android-app://') ||
				(navigator as any).standalone
			) {
				localStorage.setItem('pwaInstalled', '1');
				setIsInstalled(true);
			} else {
				window.addEventListener(
					'beforeinstallprompt',
					installHandler,
				);
				window.addEventListener(
					'onappinstalled',
					afterInstalledHandler,
				);
			}

			return () =>
				window.removeEventListener(
					'transitionend',
					installHandler,
				);
		}
	}, []);

	const handleInstall = () => {
		setIsInstalled(true);

		if (!promptInstall) {
			return;
		}
		promptInstall.prompt();
	};
	if (
		!supportsPWA ||
		isInstalled ||
		process.env.NODE_ENV !== 'production'
	)
		return null;

	return (
		<div
			dir='rtl'
			id='toast-default'
			className='fixed bottom-3 right-4 sm:right-14 flex items-center w-full max-w-xs p-4 bg-white rounded-lg shadow dark:bg-gray-800 text-rayanPrimary-dark dark:text-rayanPrimary-light'
			role='alert'
		>
			<button
				className='flex flex-shrink-0 h-full rounded-lg hover:text-gray-900 focus:ring-2 focus:ring-gray-300 dark:hover:text-white dark:hover:bg-gray-700'
				onClick={handleInstall}
			>
				<DownloadIcon />
				<span className='sr-only'>Download icon</span>
				<div className='ms-2 mt-1 text-sm font-normal'>
					Install App
				</div>
			</button>

			<button
				type='button'
				className='ms-auto -mx-1.5 -my-1.5 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8  dark:hover:text-white dark:hover:bg-gray-700'
				data-dismiss-target='#toast-default'
				aria-label='Close'
				onClick={() => setSupportsPWA(false)}
			>
				<span className='sr-only'>Close</span>
				<X />
			</button>
		</div>
	);
};

export default InstallPWA;
