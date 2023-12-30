import { securePath } from '$lib/utils.js';
import { error, redirect } from '@sveltejs/kit';

export function GET({ url, cookies }) {
	/* @migration task: add path argument */ cookies.delete('session');
	redirect(302, securePath(url.searchParams.get('redirect') || '/'));
}
