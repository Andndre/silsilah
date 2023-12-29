import { securePath } from '$lib/utils.js';
import { error, redirect } from '@sveltejs/kit';

export function GET({ url, cookies }) {
	cookies.delete('session');
	throw redirect(302, securePath(url.searchParams.get('redirect') || '/'));
}
