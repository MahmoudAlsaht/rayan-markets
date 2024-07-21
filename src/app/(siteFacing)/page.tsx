import PageHeader from '@/components/PageHeader';

export default async function Home() {
	return (
		<div className='flex flex-col justify-center items-center h-screen'>
			<PageHeader title='home' />
		</div>
	);
}
