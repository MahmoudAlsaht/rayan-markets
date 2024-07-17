import BackButtonNav from '@/components/BackButtonNav';

export default function page({
	params: { id, setting },
}: {
	params: { id: string; setting: string };
}) {
	return (
		<div dir='rtl'>
			<BackButtonNav bg={false} />
			{setting === 'username' && (
				<h1 className='text-center text-4xl py-8'>
					إعدادات اسم المستخدم
				</h1>
			)}
			{setting === 'phone' && (
				<h1 className='text-center text-4xl py-8'>
					إعدادات الهاتف
				</h1>
			)}
			{setting === 'password' && (
				<h1 className='text-center text-4xl py-8'>
					إعدادات كلمة المرور
				</h1>
			)}
			{setting === 'account-deletion' && (
				<h1 className='text-center text-destructive text-4xl py-8'>
					حذف الحساب
				</h1>
			)}
		</div>
	);
}
