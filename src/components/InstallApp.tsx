'use client';

import { useLayoutEffect, useState } from 'react';
import { DownloadIcon, X } from 'lucide-react';

const InstallPWA = () => {
	const [promptInstall, setPromptInstall] =
		useState<any>(null);

	const [isInstalled, setIsInstalled] = useState(true);
	const [showInstallButton, setShowInstallButton] =
		useState(false);

	useLayoutEffect(() => {
		setIsInstalled(() => {
			if (typeof window !== 'undefined')
				return (
					localStorage.getItem('pwaInstalled') ===
						'1' || false
				);
			else return true;
		});
		if (typeof window !== 'undefined') {
			const now = new Date().getTime();
			const startDate = localStorage.getItem('startDate');
			const isExpired =
				startDate == null
					? true
					: now - JSON.parse(startDate) > 4;
			if (isExpired) setShowInstallButton(true);
		}

		const installHandler = (e: any) => {
			localStorage.setItem('pwaInstalled', '0');
			setIsInstalled(false);
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

	const handleDismiss = () => {
		if (typeof window !== 'undefined') {
			const date =
				new Date().getTime() + 1000 * 60 * 60 * 24 * 4;
			localStorage.setItem(
				'startDate',
				JSON.stringify(date),
			);
			setShowInstallButton(false);
			return;
		}
	};

	const handleInstall = () => {
		setIsInstalled(true);

		if (!promptInstall) {
			return;
		}
		promptInstall.prompt();
	};
	if (
		isInstalled ||
		!showInstallButton ||
		process.env.NODE_ENV !== 'production'
	)
		return null;

	return (
		<div
			dir='rtl'
			id='toast-default'
			className='fixed z-50 bottom-3 sm:right-14 flex items-center w-[97%] sm:w-full mr-1 sm:mr-0  sm:max-w-xs p-4 bg-rayanSecondary-dark rounded-lg shadow'
			role='alert'
		>
			<button
				className='flex flex-shrink-0 w-[1/2] h-full rounded-lg p-4 text-rayanPrimary-light hover:bg-rayanSecondary-light'
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
				onClick={handleDismiss}
			>
				<span className='sr-only'>Close</span>
				<X />
			</button>
		</div>
	);
};

export default InstallPWA;
