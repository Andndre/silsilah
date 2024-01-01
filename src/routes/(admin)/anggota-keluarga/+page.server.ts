import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from '../$types';
import { keluarga } from '$lib/schema';
import { eq } from 'drizzle-orm';
import { db } from '$lib/server/database';

export const load: PageServerLoad = async ({ locals, url }) => {
	if (!locals.user) {
		throw redirect(303, '/login?redirect=' + url.pathname);
	}

	const query = await db.query.keluarga.findFirst({
		where: () => eq(keluarga.id, locals.user!.id),
		columns: {
			
		},
		with: {
			anggotaKeluarga: {
				columns: {
					nama: true,
					jenisKelamin: true,
					status: true,
					tanggalMeninggal: true,
					tanggalLahir: true,
				}
			}
		}
	});

	if (!query) {
		throw redirect(303, '/login?redirect=' + url.pathname);
	}

	query.anggotaKeluarga.sort((a, b) => a.tanggalLahir.getTime() - b.tanggalLahir.getTime());
	return {
		pageData: query
	};
};
