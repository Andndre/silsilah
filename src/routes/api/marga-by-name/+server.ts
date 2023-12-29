import { marga } from '$lib/schema.js';
import { db } from '$lib/server/database.js';
import { eq, like } from 'drizzle-orm';

export async function POST({ request }) {
	const json = await request.json();
	if (json.name === '') {
		return new Response(JSON.stringify([]), { status: 200 });
	}
	const margas = await db
		.select()
		.from(marga)
		.where(() => like(marga.nama, `%${json.name}%`));
	return new Response(JSON.stringify(margas), { status: 200 });
}
