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

/**
 * Validates the authentication token from the cookies.
 * @param {Cookies} cookies - The cookies object.
 * @returns {boolean} - Whether the authentication token is valid.
 */
const validateTokenFunction = (cookies: Cookies): boolean => {
	// This will look for the user's cookies and see if the auth token exists
	const currentToken = cookies.get('session');

	// If the auth token is valid (i.e. matches the string 123), then it will return `true`.
	return currentToken === '123';
};
