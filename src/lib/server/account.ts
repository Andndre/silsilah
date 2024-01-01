import { keluarga } from '$lib/schema';
import type { Cookies } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { v4 } from 'uuid';

import { db } from './database';

/**
 * Retrieves the user based on the session cookie.
 * @param cookie - The session cookie.
 * @returns The user object.
 */
export async function getUser(cookie: Cookies) {
	const me = await db.query.keluarga.findFirst({
		where: () => eq(keluarga.refreshSession, cookie.get('refresh_session')!),
	});

	return me;
}

/**
 * Retrieves the authenticated user based on the session and refresh session cookies.
 * If the refresh session cookie is present, it checks if the session cookie is missing
 * and refreshes the session if necessary.
 * @param cookie - The cookies object.
 * @returns The authenticated user object or null if not authenticated.
 */
export async function getAuthUser(cookie: Cookies) {
	const session = cookie.get('session');
	const refreshSession = cookie.get('refresh_session');

	if (refreshSession) {
		if (!session) {
			await refreshToken(cookie);
		}
		return await getUser(cookie);
	}
	return null;
}

/**
 * Refreshes the session cookie based on the refresh session cookie.
 * Generates a new session ID and updates the session and refresh session cookies.
 * @param cookie - The cookies object.
 * @returns True if the session was successfully refreshed, false otherwise.
 */
export async function refreshToken(cookie: Cookies) {
	const refreshSession = cookie.get('refresh_session')!;
	const newSession = v4();
	const newRefreshSession = v4();

	const result = await db.query.keluarga.findFirst({
		where: () => eq(keluarga.refreshSession, refreshSession),
		columns: { id: true },
	});

	if (!result) {
		return false;
	}

	const update = await db
		.update(keluarga)
		.set({
			refreshSession: newRefreshSession,
		})
		.where(eq(keluarga.id, result.id));

	cookie.set('session', newSession, {
		path: '/',
		httpOnly: true,
		secure: import.meta.env.PROD,
		expires: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
	});

	cookie.set('refresh_session', refreshSession, {
		path: '/',
		httpOnly: true,
		secure: import.meta.env.PROD,
		expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // 30 days
	});

	return true;
}

/**
 * Checks if the user is logged in based on the session cookie.
 * @param cookie - The session cookie.
 * @returns True if the user is logged in, false otherwise.
 */
export function isLoggedIn(cookie: Cookies) {
	return cookie.get('session') !== undefined;
}
