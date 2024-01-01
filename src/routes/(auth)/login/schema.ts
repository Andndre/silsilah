import { z } from 'zod';

export const formSchema = z.object({
	username: z.string().min(1, 'Inputkan Username'),
	password: z.string().min(1, 'Inputkan Password'),
});

export type FormSchema = typeof formSchema;
