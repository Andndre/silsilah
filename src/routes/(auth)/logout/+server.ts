import { securePath } from '$lib/utils.js';
import { error, redirect } from '@sveltejs/kit';

export function GET({ url, cookies }) {
	cookies.delete('session', { path: '/' });
	cookies.delete('refresh_session', { path: '/' });
	redirect(302, securePath(url.searchParams.get('redirect') || '/'));
}
