import BackButtonNav from '../../../components/BackButtonNav';

import { checkUser } from '@/app/(siteFacing)/auth/_actions/isAuthenticated';
import OptionsList from './_components/OptionsList';

export default async function OptionsPage() {
	const user = await checkUser();

	return (
		<>
			<BackButtonNav />
			<main dir='rtl' className='sm:hidden'>
				<OptionsList user={user} />
			</main>
		</>
	);
}
