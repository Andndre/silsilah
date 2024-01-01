<script lang="ts">
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import * as Form from '$lib/components/ui/form';

	import type { SuperValidated } from 'sveltekit-superforms';
	import { formSchema, type FormSchema } from './schema';
	import { superForm } from 'sveltekit-superforms/client';
	import { onMount } from 'svelte';

	import Separator from '$lib/components/ui/separator/separator.svelte';
	import InputAlamat from '$lib/components/InputAlamat.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	// import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';

	export let form: SuperValidated<FormSchema>;

	const theForm = superForm(form, {
		validators: formSchema,
		taintedMessage: null,
		onError: ({ message }) => {
			console.error(message);
		},
	});

	const { form: formStore, message } = theForm;

	onMount(() => {
		$formStore.has_ref_key = false;
	});
</script>

<!-- <SuperDebug data={$formStore} /> -->

<Form.Root method="POST" controlled form={theForm} schema={formSchema} let:config class="space-y-3">
	<Form.Field {config} name="has_ref_key">
		<Form.Item
			class="flex flex-row items-center justify-between rounded-lg border p-4 bg-primary/10"
		>
			<div class="space-y-0.5">
				<Form.Label>Hubungkan ke data yang sudah ada</Form.Label>
				<Form.Description>
					Jika data `anak` sudah pernah dibuat pada akun keluarga sebelumnya
				</Form.Description>
			</div>
			<Form.Switch bind:checked={$formStore.has_ref_key} />
		</Form.Item>
	</Form.Field>
	{#if $formStore.has_ref_key}
		<Form.Field {config} name="ref_key">
			<Form.Item>
				<Form.Label>Ref Key</Form.Label>
				<Form.Input placeholder="Masukkan Ref Key" />
				<Form.Validation />
			</Form.Item>
		</Form.Field>
	{:else}
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
	{/if}
	<Separator />
	<Form.Button class="w-full">Tambah</Form.Button>
</Form.Root>

{#if $message}
	<AlertDialog.Root open={true}>
		<AlertDialog.Content>
			<AlertDialog.Header>
				<AlertDialog.Title>Maaf</AlertDialog.Title>
				<AlertDialog.Description>{$message}</AlertDialog.Description>
			</AlertDialog.Header>
			<AlertDialog.Footer>
				<Button
					on:click={() => {
						$message = '';
					}}
					>Tutup
				</Button>
			</AlertDialog.Footer>
		</AlertDialog.Content>
	</AlertDialog.Root>
{/if}
