import BackButtonNav from '@/components/BackButtonNav';
import { DistrictForm } from '../_components/DistrictForm';
import PageHeader from '@/components/PageHeader';

export default function NewDistrict() {
	return (
		<main dir='rtl'>
			<BackButtonNav bg={false} />
			<PageHeader title='إضافة منطقة' />

			<DistrictForm />
		</main>
	);
}