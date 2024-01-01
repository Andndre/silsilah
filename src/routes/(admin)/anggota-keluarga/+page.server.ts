import { keluarga } from '$lib/schema';
import { db } from '$lib/server/database';
import { redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

import type { PageServerLoad } from '../$types';

export const load: PageServerLoad = async ({ locals, url }) => {
	if (!locals.user) {
		throw redirect(303, '/login?redirect=' + url.pathname);
	}

	const query = await db.query.keluarga.findFirst({
		where: () => eq(keluarga.id, locals.user!.id),
		columns: {},
		with: {
			anggotaKeluarga: {
				columns: {
					nama: true,
					jenisKelamin: true,
					status: true,
					tanggalMeninggal: true,
					tanggalLahir: true,
					gambar: true
				},
			},
		},
	});

	if (!query) {
		throw redirect(303, '/login?redirect=' + url.pathname);
	}

	query.anggotaKeluarga.sort((a, b) => a.tanggalLahir.getTime() - b.tanggalLahir.getTime());
	return {
		pageData: query,
	};
};
