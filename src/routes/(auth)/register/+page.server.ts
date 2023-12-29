import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import { formSchema } from './schema';
import { db } from '$lib/server/database';
import { agama, akun, anggotaKeluarga, keluarga } from '$lib/schema';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async () => {
	const allAgama = await db.select().from(agama);

	return {
		form: superValidate(formSchema),
		allAgama
	};
};

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, formSchema);
		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		let idMarga: string;

		if (form.data.is_turunan) {
			if (!form.data.turunan_kk) {
				return fail(400, {
					form,
					message: 'Turunan KK harus diisi'
				});
			}
			const turunan = await db
				.select()
				.from(keluarga)
				.where(eq(keluarga.noKK, form.data.turunan_kk))
				.limit(1);
			if (!turunan.length) {
				return fail(400, {
					form,
					message: 'Turunan KK tidak ditemukan'
				});
			}
			idMarga = turunan[0].idMarga;
		} else {
			if (!form.data.id_marga) {
				return fail(400, {
					form,
					message: 'ID Marga harus diisi'
				});
			}
			idMarga = form.data.id_marga;
		}

		await db.transaction(async (tx) => {
			await tx.insert(keluarga).values({
				idMarga: form.data.id_marga!,
				noKK: form.data.no_kk
			});
			await tx.insert(akun).values({
				noKK: form.data.no_kk,
				turunanDari: form.data.is_turunan ? form.data.turunan_kk : null,
				aktif: !form.data.is_turunan // Turunan akan aktif jika diterima oleh leluhur
			});
			await tx.insert(anggotaKeluarga).values({
				nik: form.data.nik,
				noKK: form.data.no_kk,
				status: form.data.status,
				tanggalLahir: new Date(form.data.tanggal_lahir),
				agama: form.data.agama,
				nama: form.data.nama_kepala_keluarga
			});
		});

		return {
			form
		};
	}
};
