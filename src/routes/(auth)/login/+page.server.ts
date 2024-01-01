import { agama, anggota, keluarga, marga } from '$lib/schema';
import { db } from '$lib/server/database';
import { securePath } from '$lib/utils';
import { fail, redirect } from '@sveltejs/kit';
import bcrypt from 'bcrypt';
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

		let message = false;

		try {
			await db.transaction(async (tx) => {
				const user = await tx.query.keluarga.findFirst({
					where: () => eq(keluarga.username, form.data.username),
				});

				if (!user) {
					form.errors.username = ['Username tidak ditemukan'];
					message = true;
					return;
				}

				if (!bcrypt.compareSync(form.data.password, user.password)) {
					form.errors.password = ['Password salah'];
					message = true;
					return;
				}

				event.locals.user = user;
			});

			if (message) {
				return fail(400, {
					form,
				});
			}
		} catch (err) {
			console.error(err);
			return fail(500, {
				message: 'Internal server error',
			});
		}

		if (!event.locals.user) {
			return fail(401, {
				message: 'Unauthorized',
			});
		}

		event.cookies.set('refresh_session', event.locals.user?.refreshSession, {
			path: '/',
			httpOnly: true,
			secure: import.meta.env.PROD,
			expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // 30 days
		});

		redirect(302, securePath(event.url.searchParams.get('redirect') || '/'));
	},
};
