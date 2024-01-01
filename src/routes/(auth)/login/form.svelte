<script lang="ts">
	import * as Form from '$lib/components/ui/form';

	import type { SuperValidated } from 'sveltekit-superforms';
	import { formSchema, type FormSchema } from './schema';
	import { superForm } from 'sveltekit-superforms/client';
	import Separator from '$lib/components/ui/separator/separator.svelte';

	export let form: SuperValidated<FormSchema>;

	const theForm = superForm(form, {
		validators: formSchema,
		taintedMessage: null,
		onError: ({ message }) => {
			console.error(message);
		},
	});

	// const { form: formStore } = theForm;
</script>

<Form.Root method="POST" controlled form={theForm} schema={formSchema} let:config class="space-y-3">
	<Form.Field {config} name="username">
		<Form.Item>
			<Form.Label>Username</Form.Label>
			<Form.Input placeholder="Masukkan username" autocomplete="username" />
			<Form.Validation />
		</Form.Item>
	</Form.Field>
	<Form.Field {config} name="password">
		<Form.Item>
			<Form.Label>Password</Form.Label>
			<Form.Input type="password" placeholder="******" autocomplete="current-password" />
			<Form.Validation />
		</Form.Item>
	</Form.Field>
	<Separator />
	<Form.Button class="w-full">Login</Form.Button>
</Form.Root>
