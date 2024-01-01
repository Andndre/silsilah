import { anggota } from '$lib/schema';
import { db } from '$lib/server/database';
import type { Alamat } from '$lib/types';
import { fail } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, fetch }) => {
	const user = locals.user;

	// Not possible
	if (!user) {
		return fail(400, {
			message: 'User not found',
		});
	}

	const istri = await db.query.anggota.findMany({
		where: () => eq(anggota.id, user?.istri),
		columns: {
			agama: true,
			nama: true,
			tanggalLahir: true,
			tempatLahir: true,
		},
	});

	const alamat = (await (await fetch(`/api/lokasi/ringkas/${user.alamat}`)).json()) as Alamat;

	console.log({ user, alamat });
};
