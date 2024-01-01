import { anggota, keluarga } from '$lib/schema';
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

	const query = await db.query.keluarga.findFirst({
		where: () => eq(keluarga.id, user.id),
		columns: {},
		with: {
			anggotaKeluarga: {
				columns: {
					nama: true,
				},
			},
			suami_: {
				columns: {
					nama: true,
					keluargaAsal: true,
					tanggalMeninggal: true,
					tanggalLahir: true,
					tempatLahir: true,
					refKey: true,
					status: true,
				},
				with: {
					agama_: {
						columns: {
							nama: true,
						},
					},
					keluargaAsal: {
						columns: {
							marga: true,
						},
					},
				},
			},
			istri_: {
				columns: {
					nama: true,
					keluargaAsal: true,
					tanggalMeninggal: true,
					tanggalLahir: true,
					tempatLahir: true,
					refKey: true,
					status: true,
				},
				with: {
					agama_: {
						columns: {
							nama: true,
						},
					},
					keluargaAsal: {
						columns: {
							marga: true,
						},
					},
				},
			},
			marga_: {
				columns: {
					nama: true,
					keterangan: true,
				},
			},
		},
	});

	if (!query) {
		throw new Error('Keluarga not found');
	}

	const responseAlamat = await fetch(`/api/lokasi/ringkas/${user.alamat}`);
	const responseAlamatLahirSuami = await fetch(
		`/api/lokasi/kelurahan/satu/${query.suami_.tempatLahir}`,
	);
	const responseAlamatLahirIstri = await fetch(
		`/api/lokasi/kelurahan/satu/${query.istri_.tempatLahir}`,
	);

	if (!responseAlamat.ok || !responseAlamatLahirSuami.ok || !responseAlamatLahirIstri.ok) {
		throw new Error('Failed to fetch data');
	}

	const alamat = (await responseAlamat.json()) as Alamat;
	const kelurahanLahirSuami = (await responseAlamatLahirSuami.json()).name as string;
	const kelurahanLahirIstri = (await responseAlamatLahirIstri.json()).name as string;

	return {
		pageData: {
			user,
			alamat: alamat,
			kelurahanLahirSuami,
			kelurahanLahirIstri,
			...query,
		},
	};
};
