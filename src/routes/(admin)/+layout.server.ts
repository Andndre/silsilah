import { redirect } from '@sveltejs/kit';

import type { LayoutServerLoad } from './$types';
import { db } from '$lib/server/database';
import { keluarga } from '$lib/schema';
import { eq } from 'drizzle-orm';

export const load: LayoutServerLoad = async ({ locals, url }) => {
	// Check if the user is not logged in
	if (!locals.user) {
		// Redirect the user to the login page with the current URL as a redirect parameter
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
					tanggalMeninggal: true
				}
			}
		}
	})

	// Return an empty object
	return {};
};
