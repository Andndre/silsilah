<script lang="ts">
	import * as Form from '$lib/components/ui/form';

	import type { SuperValidated } from 'sveltekit-superforms';
	import { formSchema, type FormSchema } from './schema';
	import { superForm } from 'sveltekit-superforms/client';

	import Separator from '$lib/components/ui/separator/separator.svelte';
	import InputAlamat from '$lib/components/InputAlamat.svelte';
	// import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';

	export let form: SuperValidated<FormSchema>;

	const theForm = superForm(form, {
		validators: formSchema,
		taintedMessage: null,
		onError: ({ message }) => {
			console.error(message);
		},
	});

	const { form: formStore } = theForm;
</script>

<!-- <SuperDebug data={$formStore} /> -->

<Form.Root method="POST" controlled form={theForm} schema={formSchema} let:config class="space-y-3">
	<Form.Field {config} name="name">
		<Form.Item>
			<Form.Label>Nama Lengkap</Form.Label>
			<Form.Input placeholder="Masukkan Nama Lengkap" />
			<Form.Validation />
		</Form.Item>
	</Form.Field>
	<Form.Field {config} name="jenis_kelamin">
		<Form.Item>
			<Form.Label>Jenis Kelamin</Form.Label>
			<Form.Select>
				<Form.SelectTrigger placeholder="Jenis Kelamin" />
				<Form.SelectContent>
					<Form.SelectItem value="L">Laki Laki</Form.SelectItem>
					<Form.SelectItem value="P">Perempuan</Form.SelectItem>
				</Form.SelectContent>
			</Form.Select>
		</Form.Item>
	</Form.Field>
	<Form.Field {config} name="tanggal_lahir">
		<Form.Item>
			<Form.Label>Tanggal Lahir</Form.Label>
			<Form.Input type="date" />
			<Form.Validation />
		</Form.Item>
	</Form.Field>
	<Form.Field {config} name="tempat_lahir">
		<Form.Item>
			<Form.Label>Tempat Lahir</Form.Label>
			<Form.Input class="hidden" placeholder="Tempat lahir" />
		</Form.Item>
	</Form.Field>
	<InputAlamat bind:alamat={$formStore.tempat_lahir} class="py-1" />
	<Separator />
	<Form.Button class="w-full">Tambah</Form.Button>
</Form.Root>
