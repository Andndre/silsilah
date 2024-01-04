<script lang="ts">
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import * as Form from '$lib/components/ui/form';
	import * as Avatar from '$lib/components/ui/avatar';

	import type { SuperValidated } from 'sveltekit-superforms';
	import type { Agama, Anggota } from '$lib/schema';
	import { JenisKelamin } from '$lib/types';
	import { formSchema, type FormSchema } from './schema';
	import { superForm } from 'sveltekit-superforms/client';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	import Separator from '$lib/components/ui/separator/separator.svelte';
	import InputAlamat from '$lib/components/InputAlamat.svelte';
	// import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';

	export let form: SuperValidated<FormSchema>;
	export let prevData: Anggota;
	export let allAgama: Agama[];

	const theForm = superForm(form, {
		validators: formSchema,
		taintedMessage: null,
		onError: ({ message }) => {
			console.error(message);
		},
	});

	const { form: formStore } = theForm;

	onMount(() => {
		if (browser) {
			const preview = document.getElementById('filePreview') as HTMLImageElement;
			const input = document.getElementById('fileInput') as HTMLInputElement;

			if (!preview || !input) {
				console.error('preview or input not found');
				return;
			}

			input.onchange = (e) => {
				// @ts-ignore it will works
				preview.src = URL.createObjectURL(e.target.files[0]!);
			};
		}
	});
</script>

<!-- <SuperDebug data={$formStore} /> -->

<Form.Root
	method="POST"
	controlled
	form={theForm}
	schema={formSchema}
	let:config
	class="space-y-3"
	enctype="multipart/form-data"
>
	<div class="grid grid-cols-12 gap-12">
		<div class="space-y-3 col-span-12 lg:col-span-8">
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
					<Form.Select
						selected={{
							value: $formStore.jenis_kelamin,
							label:
								$formStore.jenis_kelamin === JenisKelamin.LAKI_LAKI
									? 'Laki-laki'
									: 'Perempuan',
						}}
					>
						<Form.SelectTrigger placeholder="Jenis Kelamin" />
						<Form.SelectContent>
							<Form.SelectItem value={JenisKelamin.LAKI_LAKI}
								>Laki-laki</Form.SelectItem
							>
							<Form.SelectItem value={JenisKelamin.PEREMPUAN}
								>Perempuan</Form.SelectItem
							>
						</Form.SelectContent>
					</Form.Select>
				</Form.Item>
			</Form.Field>
			<Form.Field {config} name="agama">
				<Form.Item>
					<Form.Label>Agama</Form.Label>
					<Form.Select
						selected={{
							value: $formStore.agama,
							label: allAgama.find((agama) => agama.id === $formStore.agama)?.nama,
						}}
					>
						<Form.SelectTrigger placeholder="Agama" />
						<Form.SelectContent>
							{#each allAgama as agama}
								<Form.SelectItem bind:value={agama.id}>{agama.nama}</Form.SelectItem
								>
							{/each}
						</Form.SelectContent>
					</Form.Select>
				</Form.Item>
			</Form.Field>
			<Form.Field {config} name="tanggal_lahir">
				<Form.Item>
					<Form.Label>Tanggal Lahir</Form.Label>
					<Form.Input type="date" bind:value={$formStore.tanggal_lahir} />
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
		</div>
		<div class="col-span-12 lg:col-span-4">
			<Form.Field {config} name="image">
				<Form.Item>
					<Form.Label>Gambar</Form.Label>
					<div class="aspect-square">
						<Avatar.Root class="w-full h-full aspect-square">
							<Avatar.Image
								src={prevData.gambar ||
									`/images/profile-${prevData.jenisKelamin}.png`}
								alt={prevData.nama}
								class="object-cover"
								id="filePreview"
							/>
							<Avatar.Fallback>##</Avatar.Fallback>
						</Avatar.Root>
					</div>
					<Form.Input type="file" id="fileInput" name="image" />
					<Form.Validation />
				</Form.Item>
			</Form.Field>
		</div>
	</div>
	<Separator />
	<Form.Button class="w-full">Edit</Form.Button>
</Form.Root>
