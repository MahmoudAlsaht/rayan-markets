'use server';
import db from '@/db/db';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

export const checkUser = async () => {
	const token = cookies().get('token');

	if (token == null) return null;

	const decoded: any = jwt.verify(
		token?.value as string,
		process.env.SECRET_1,
	);

	const user = await db.user.findUnique({
		where: { id: decoded.id },
		select: {
			id: true,
			phone: true,
			username: true,
			role: true,
			profileId: true,
		},
	});

	if (user == null) return null;

	if (user.profileId == null) {
		const profile = await db.profile.create({
			data: {
				userId: user.id,
			},
		});

		await db.user.update({
			where: {
				id: user.id,
			},
			data: {
				profileId: profile.id,
			},
		});
	}

	return user;
};
