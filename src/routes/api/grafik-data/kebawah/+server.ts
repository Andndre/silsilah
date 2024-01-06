import { db } from '$lib/server/database.js';

export const GET = async ({ locals }) => {
	if (!locals.user)
		return new Response(
			JSON.stringify({
				message: 'Unauthorized',
			}),
			{
				status: 403,
			},
		);

	const user = locals.user;

	const res = await db.transaction(async (tx) => {});

	return new Response();
};
