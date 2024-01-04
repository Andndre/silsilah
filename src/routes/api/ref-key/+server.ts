import { anggota } from '$lib/schema.js';
import { db } from '$lib/server/database.js';
import { and, eq } from 'drizzle-orm';
import { v4 } from 'uuid';

export async function GET({ request, locals }) {
	if (!locals.user) {
		return new Response(
			JSON.stringify({
				message: 'Unauthorized',
			}),
			{ status: 401 },
		);
	}

	const id = new URL(request.url).searchParams.get('id');

	if (!id) {
		return new Response(
			JSON.stringify({
				message: 'Bad Request',
			}),
			{ status: 400 },
		);
	}

	console.log('changing ref key of ' + locals.user.id + ', anggota id = ' + id);

	const newRefKey = v4();

	await db
		.update(anggota)
		.set({
			refKey: newRefKey,
		})
		.where(and(eq(anggota.keluargaAsal, locals.user.id), eq(anggota.id, +id)));

	return new Response(JSON.stringify({ newRefKey }), { status: 200 });
}
