import { agama, anggota } from '$lib/schema';
import { db } from '$lib/server/database';
import { error, fail, redirect } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';
import { superValidate } from 'sveltekit-superforms/server';

import type { Actions, PageServerLoad } from './$types';
import { formSchema } from './schema';
import type { JenisKelamin } from '$lib/types';
import sharp from 'sharp';
import { API_HOSTING_GAMBAR, API_KEY_HOSTING_GAMBAR } from '$env/static/private';

export const load: PageServerLoad = async ({ locals, params }) => {
	const user = locals.user!;
	const id = +params.id;

	const result = await db.query.anggota.findFirst({
		where: () => and(eq(anggota.id, id), eq(anggota.keluargaAsal, user.id)),
	})

	if (!result) {
		throw error(404, 'Anggota tidak ditemukan');
	}

	const form = await superValidate({
		name: result.nama,
		jenis_kelamin: result.jenisKelamin as JenisKelamin,
		tempat_lahir: result.tempatLahir,
		tanggal_lahir: result.tanggalLahir.toLocaleDateString('en-CA'),
		agama: result.agama
	}, formSchema);	

	// Retrieve all records from the 'agama' table in the database
	const allAgama = await db.select().from(agama);

	return {
		form,
		anggota: result,
		allAgama
	};
};

export const actions: Actions = {
	default: async (event) => {
		// Validate the form using the superValidate function

		const formData = await event.request.formData();

		const form = await superValidate(formData, formSchema);
		if (!form.valid) {
			return fail(400, {
				form,
			});
		}

		const formFile = formData.get('image') as File;
		let newAvatarUrl: string | undefined = undefined;

		if (formFile.size !== 0) {
			console.log('file inserted')
			console.log(formFile);
			
			// Convert the file to webp format with a quality of 20
			const result = await sharp(await formFile.arrayBuffer())
				.webp({ quality: 20 })
				.toBuffer();
	
			// Convert the result to base64 encoding
			const base64Image = Buffer.from(result).toString('base64');
	
			// Create a new FormData object to send the image data
			const formDataSend = new FormData();
			formDataSend.append('key', API_KEY_HOSTING_GAMBAR);
			formDataSend.append('source', base64Image);
	
			// Send the image data to the hosting service
			const response = await event.fetch(API_HOSTING_GAMBAR, {
				method: 'POST',
				body: formDataSend,
			});

			const json = await response.json();

			newAvatarUrl = json.image.url as string;
		}

		try {
			await db.transaction(async (tx) => {
				const [{ affectedRows }] = await tx.update(anggota).set({
					agama: form.data.agama,
					jenisKelamin: form.data.jenis_kelamin,
					nama: form.data.name,
					tempatLahir: form.data.tempat_lahir,
					tanggalLahir: new Date(form.data.tanggal_lahir),
					gambar: newAvatarUrl
				}).where(eq(anggota.id, +event.params.id));

				if (!affectedRows) {
					throw error(404, 'Anggota tidak ditemukan');
				}
			});
			
		} catch (err) {
			return fail(500, {
				form,
			});
		}

		// Redirect the user to the '/anggota-keluarga' page
		redirect(303, '/anggota-keluarga');
	},
};
