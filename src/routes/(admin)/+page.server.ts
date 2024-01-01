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
			suami: {
				columns: {
					nama: true,
					keluargaAsal: true,
					tanggalMeninggal: true,
					tanggalLahir: true,
					tempatLahir: true,
					refKey: true,
					status: true
				},
				with: {
					agama: {
						columns: {
							nama: true
						}
					},
					keluargaAsal: {
						columns: {
							marga: true
						}
					}
				}
			},
			istri: {
				columns: {
					nama: true,
					keluargaAsal: true,
					tanggalMeninggal: true,
					tanggalLahir: true,
					tempatLahir: true,
					refKey: true,
					status: true
				},
				with: {
					agama: {
						columns: {
							nama: true
						}
					},
					keluargaAsal: {
						columns: {
							marga: true
						}
					}
				}
			},
			marga: {
				columns: {
					nama: true,
					keterangan: true
				},
			}
		},
	});

	if (!query) {
		return fail(400, {
			message: 'User not found',
		});
	}

	const responseAlamat = await fetch(`/api/lokasi/ringkas/${user.alamat}`);
	const responseAlamatLahirSuami = await fetch(`/api/lokasi/kelurahan/satu/${query.suami.tempatLahir}`);
	const responseAlamatLahirIstri = await fetch(`/api/lokasi/kelurahan/satu/${query.istri.tempatLahir}`);

	if (!responseAlamat.ok || !responseAlamatLahirSuami.ok || !responseAlamatLahirIstri.ok) {
		return fail(400, {
			message: 'Alamat not found',
		});
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
