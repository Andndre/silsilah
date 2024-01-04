import { anggota, keluarga } from '$lib/schema';
import { db } from '$lib/server/database';
import { redirect } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';

import type { PageServerLoad } from '../$types';
import type { Actions } from './$types';

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
					tempatLahir: true,
					gambar: true,
					id: true,
					refKey: true,
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

export const actions: Actions = {
	delete: async ({ request, locals }) => {
		const data = await request.formData();
		const id = data.get('id');

		if (!id) {
			return {
				success: false,
				message: 'ID tidak ditemukan',
			};
		}

		const [{ affectedRows }] = await db
			.delete(anggota)
			.where(and(eq(anggota.id, +id), eq(anggota.keluargaAsal, locals.user!.id)));

		if (affectedRows === 0) {
			return {
				success: false,
				message: 'Gagal menghapus anggota (anggota tidak ada dalam keluarga)',
			};
		}

		return {
			success: true,
			message: 'Anggota berhasil di hapus',
		};
	},
};
