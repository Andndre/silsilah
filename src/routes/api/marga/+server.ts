import { marga } from '$lib/schema.js';
import { db } from '$lib/server/database.js';
import { error } from '@sveltejs/kit';

export async function POST({ request }) {
	const json = await request.json();
	if (json.nama === '' || json.keterangan === '') {
		error(400, 'Data tidak lengkap');
	}
	const margas = await db.insert(marga).values({
		nama: json.nama,
		keterangan: json.keterangan,
	});

	return new Response(JSON.stringify(margas), { status: 200 });
}
