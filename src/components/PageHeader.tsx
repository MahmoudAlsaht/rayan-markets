export default function PageHeader({
	title,
}: {
	title: string;
}) {
	return (
		<h1 className='text-center mt-16 text-4xl mb-4'>
			{title}
		</h1>
	);
}
