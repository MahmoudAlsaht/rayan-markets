import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import db from '@/db/db';

export const checkUser = async () => {
	const token = cookies().get('token');

	const decoded: any = jwt.verify(
		token?.value as string,
		process.env.SECRET_1,
	);

	const user = db.user.findUnique({
		where: { id: decoded.id },
	});

	if (user == null) return null;

	return user;
};
