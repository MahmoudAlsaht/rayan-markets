import PageHeader from '@/components/PageHeader';
import Banner from './_components/Banner';

export default async function Home() {
	return (
		<main dir='rtl'>
			<Banner type='main' />
			<div>
				<PageHeader title='home' />
			</div>
		</main>
	);
}
