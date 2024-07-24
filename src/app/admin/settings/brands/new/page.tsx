import BackButtonNav from '@/components/BackButtonNav';
import PageHeader from '@/components/PageHeader';
import { BrandForm } from '../_components/BrandForm';

export default function NewBrand() {
	return (
		<main dir='rtl'>
			<BackButtonNav bg={false} />
			<PageHeader title='إضافة علامة تجارية جديدة' />

			<BrandForm />
		</main>
	);
}
