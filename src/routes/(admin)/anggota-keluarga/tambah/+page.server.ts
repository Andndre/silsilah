import { anggota, keluarga } from '$lib/schema';
import { db } from '$lib/server/database';
import { fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { message, superValidate } from 'sveltekit-superforms/server';

import type { Actions, PageServerLoad } from './$types';
import { formSchema } from './schema';

export const load: PageServerLoad = async () => {
	return {
		form: await superValidate(formSchema),
	};
};

export const actions: Actions = {
	default: async (event) => {
		// Validate the form using the superValidate function
		const form = await superValidate(event, formSchema);
		if (!form.valid) {
			return fail(400, {
				form,
			});
		}

		const user = event.locals.user!;

		let error = '';

		try {
			await db.transaction(async (tx) => {
				if (form.data.has_ref_key) {
					if (!form.data.ref_key) {
						error = 'Ref Key tidak boleh kosong';
						return;
					}

					const agt = await tx.query.anggota.findFirst({
						where: () => eq(anggota.refKey, form.data.ref_key!),
						columns: { id: true, keluargaAsal: true },
					})

					if (!agt) {
						error = 'Ref Key tidak ditemukan';
						return;
					}

					if (agt.keluargaAsal === user.id) {
						error = 'Ref Key sudah terdaftar';
						return;
					}

					// Update the anggota table in the database based on the ref_key
					await tx
						.update(anggota)
						.set({
							keluargaAsal: user.id,
						})
						.where(eq(anggota.refKey, form.data.ref_key!));
				} else {
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
						error = 'Keluarga not found';
						return;
					}

					if (
						!form.data.name ||
						!form.data.jenis_kelamin ||
						!form.data.tanggal_lahir ||
						!form.data.tempat_lahir
					) {
						error = 'Form harus diisi semua';
						return;
					}

					// Insert a new record into the anggota table in the database
					await tx.insert(anggota).values({
						agama: k.suami_.agama,
						nama: form.data.name,
						status: 'BM',
						keluargaAsal: user.id,
						jenisKelamin: form.data.jenis_kelamin,
						tanggalLahir: new Date(form.data.tanggal_lahir),
						tempatLahir: form.data.tempat_lahir,
					});
				}
			});

			if (error) {
				return message(form, error);
			}
		} catch (err) {
			return fail(500, {
				form,
			});
		}

		// Redirect the user to the '/anggota-keluarga' page
		redirect(303, '/anggota-keluarga');
	},
};
