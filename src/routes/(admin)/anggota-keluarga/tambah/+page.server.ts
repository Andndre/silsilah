import { anggota, keluarga } from '$lib/schema';
import { db } from '$lib/server/database';
import { fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { superValidate } from 'sveltekit-superforms/server';

import type { Actions, PageServerLoad } from './$types';
import { formSchema } from './schema';

export const load: PageServerLoad = async () => {
	return {
		form: await superValidate(formSchema),
	};
};

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, formSchema);
		if (!form.valid) {
			return fail(400, {
				form,
			});
		}

		const user = event.locals.user!;

		try {
			await db.transaction(async (tx) => {
				const k = await tx.query.keluarga.findFirst({
					where: () => eq(keluarga.id, user.id),
					columns: {},
					with: {
						suami_: {
							columns: {
								agama: true,
							},
						},
					},
				});
				if (!k) {
					throw new Error('Keluarga not found');
				}
				await tx.insert(anggota).values({
					agama: k.suami_.agama,
					nama: form.data.name,
					status: 'BM',
					keluargaAsal: user.id,
					jenisKelamin: form.data.jenis_kelamin,
					tanggalLahir: new Date(form.data.tanggal_lahir),
					tempatLahir: form.data.tempat_lahir,
				});
			});
		} catch (err) {
			return fail(500, {
				form,
			});
		}

		redirect(303, '/anggota-keluarga');
	},
};
