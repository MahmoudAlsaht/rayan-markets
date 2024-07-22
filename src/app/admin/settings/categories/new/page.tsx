import BackButtonNav from '@/components/BackButtonNav';
import PageHeader from '@/components/PageHeader';
import { CategoryForm } from '../_components/CategoryForm';

export default function NewCategory() {
	return (
		<main dir='rtl'>
			<BackButtonNav bg={false} />
			<PageHeader title='إضافة قسم جديد' />

			<CategoryForm />
		</main>
	);
}
