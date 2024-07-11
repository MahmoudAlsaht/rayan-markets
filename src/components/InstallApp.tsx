'use client';
import {
	SyntheticEvent,
	useLayoutEffect,
	useState,
} from 'react';

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
		const userAgent = navigator.userAgent;

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

	const onClick = () => {
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
		<main dir='rtl'>
			{/* <Snackbar
				open={open}
				onClose={handleClose}
				message={
					<Button
						variant='outlined'
						aria-label='Install app'
						title='Install app'
						onClick={onClick}
					>
						Install <InstallMobileIcon />
					</Button>
				}
				action={
					<IconButton
						size='small'
						aria-label='close'
						color='inherit'
						onClick={handleClose}
					>
						<CloseIcon fontSize='small' />
					</IconButton>
				}
			/> */}
		</main>
	);
};

export default InstallPWA;
