import { getAuthUser } from '$lib/server/account';
import type { Cookies } from '@sveltejs/kit';

/**
 * Handles the incoming request and sets the authenticated user in the event's locals.
 */
export const handle = async ({ event, resolve }) => {
	// Set the authenticated user in the event's locals
	event.locals.user = (await getAuthUser(event.cookies)) || null;

	// Resolve the event and get the response
	const response = await resolve(event);

	// Return the response
	return response;
};
