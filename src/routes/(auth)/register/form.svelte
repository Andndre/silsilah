<script lang="ts">
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import * as Card from '$lib/components/ui/card';
	import * as Form from '$lib/components/ui/form';

	import type { SuperValidated } from 'sveltekit-superforms';
	import { formSchema, type FormSchema } from './schema';
	import { superForm } from 'sveltekit-superforms/client';
	import type { agama } from '$lib/schema';
	import type { InferSelectModel } from 'drizzle-orm';

	import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';
	import InputAlamat from '$lib/components/InputAlamat.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import InputMarga from '$lib/components/InputMarga.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { onMount } from 'svelte';

	export let form: SuperValidated<FormSchema>;
	export let pilihanAgama: InferSelectModel<typeof agama>[];

	let refkeySuami = false;
	let refkeyIstri = false;

	const theForm = superForm(form, {
		validators: formSchema,
		taintedMessage: null,
	});

	const { form: formStore, message } = theForm;

	onMount(() => {
		$formStore.suami_has_ref_key = false;
		$formStore.istri_has_ref_key = false;
	});
</script>

<SuperDebug data={$formStore} />

<Form.Root method="POST" controlled form={theForm} schema={formSchema} let:config class="space-y-3">
	<!-- DATA AYAH -->
	<Card.Root>
		<Card.Header>
			<Card.Title>Data Ayah</Card.Title>
			<Card.Description>Inputkan data Ayah</Card.Description>
		</Card.Header>
		<Card.Content class="space-y-2">
			<Form.Field {config} name="suami_has_ref_key">
				<Form.Item class="flex flex-row items-center justify-between rounded-lg border p-4">
					<div class="space-y-0.5">
						<Form.Label>Hubungkan ke data sebelumnya</Form.Label>
						<Form.Description>
							Jika `ayah` sudah pernah ditambahkan pada akun keluarga sebelumnya
							(orang tua)
						</Form.Description>
					</div>
					<Form.Switch bind:checked={$formStore.suami_has_ref_key} />
				</Form.Item>
			</Form.Field>
			{#if $formStore.suami_has_ref_key}
				<Form.Field {config} name="suami_ref_key">
					<Form.Item>
						<Form.Label>Referensi</Form.Label>
						<Form.Input placeholder="Masukkan referensi" />
						<Form.FormDescription>
							Masukkan referensi dari data sebelumnya (dapatkan dari halaman Admin >
							Data Keluarga)
						</Form.FormDescription>
					</Form.Item>
				</Form.Field>
			{:else}
				<Form.Field {config} name="suami_nama">
					<Form.Item>
						<Form.Label>Nama</Form.Label>
						<Form.Input placeholder="Nama lengkap" />
					</Form.Item>
				</Form.Field>
				<Form.Field {config} name="suami_tempat_lahir">
					<Form.Item>
						<Form.Label>Tempat Lahir</Form.Label>
						<Form.Input class="hidden" placeholder="Tempat lahir" />
					</Form.Item>
				</Form.Field>
				<InputAlamat bind:alamat={$formStore.suami_tempat_lahir} class="py-1" />
				<Form.Field {config} name="suami_agama">
					<Form.Item>
						<Form.Label>Agama</Form.Label>
						<Form.Select>
							<Form.SelectTrigger placeholder="Pilih agama" />
							<Form.SelectContent>
								{#each pilihanAgama as agama}
									<Form.SelectItem value={agama.id}>{agama.nama}</Form.SelectItem>
								{/each}
							</Form.SelectContent>
						</Form.Select>
					</Form.Item>
				</Form.Field>
				<Form.Field {config} name="suami_tanggal_lahir">
					<Form.Item>
						<Form.Label>Tanggal Lahir</Form.Label>
						<Form.Input type="date" />
					</Form.Item>
				</Form.Field>
			{/if}
		</Card.Content>
	</Card.Root>
	<!-- DATA IBU -->
	<Card.Root>
		<Card.Header>
			<Card.Title>Data Ibu</Card.Title>
			<Card.Description>Inputkan data Ibu</Card.Description>
		</Card.Header>
		<Card.Content class="space-y-2">
			<Form.Field {config} name="istri_has_ref_key">
				<Form.Item class="flex flex-row items-center justify-between rounded-lg border p-4">
					<div class="space-y-0.5">
						<Form.Label>Hubungkan ke data sebelumnya</Form.Label>
						<Form.Description>
							Jika `ayah` sudah pernah ditambahkan pada akun keluarga sebelumnya
							(orang tua)
						</Form.Description>
					</div>
					<Form.Switch bind:checked={$formStore.istri_has_ref_key} />
				</Form.Item>
			</Form.Field>
			{#if $formStore.istri_has_ref_key}
				<Form.Field {config} name="istri_ref_key">
					<Form.Item>
						<Form.Label>Referensi</Form.Label>
						<Form.Input placeholder="Masukkan referensi" />
						<Form.FormDescription>
							Masukkan referensi dari data sebelumnya (dapatkan dari halaman Admin >
							Data Keluarga)
						</Form.FormDescription>
					</Form.Item>
				</Form.Field>
			{:else}
				<Form.Field {config} name="istri_nama">
					<Form.Item>
						<Form.Label>Nama</Form.Label>
						<Form.Input placeholder="Nama lengkap" />
					</Form.Item>
				</Form.Field>
				<Form.Field {config} name="istri_tempat_lahir">
					<Form.Item>
						<Form.Label>Tempat Lahir</Form.Label>
						<Form.Input class="hidden" placeholder="Tempat lahir" />
					</Form.Item>
				</Form.Field>
				<InputAlamat bind:alamat={$formStore.istri_tempat_lahir} class="py-1" />
				<Form.Field {config} name="istri_agama">
					<Form.Item>
						<Form.Label>Agama</Form.Label>
						<Form.Select>
							<Form.SelectTrigger placeholder="Pilih agama" />
							<Form.SelectContent>
								{#each pilihanAgama as agama}
									<Form.SelectItem bind:value={agama.id}
										>{agama.nama}</Form.SelectItem
									>
								{/each}
							</Form.SelectContent>
						</Form.Select>
					</Form.Item>
				</Form.Field>
				<Form.Field {config} name="istri_tanggal_lahir">
					<Form.Item>
						<Form.Label>Tanggal Lahir</Form.Label>
						<Form.Input type="date" />
					</Form.Item>
				</Form.Field>
			{/if}
		</Card.Content>
	</Card.Root>
	<!-- DATA KELUARGA -->
	<Card.Root>
		<Card.Header>
			<Card.Title>Keluarga</Card.Title>
			<Card.Description>Inputkan data keluarga</Card.Description>
		</Card.Header>
		<Card.Content class="space-y-2">
			<Form.Field {config} name="alamat_tinggal">
				<Form.Item>
					<Form.Label>Alamat Tinggal</Form.Label>
					<Form.Input class="hidden" />
					<Form.Description
						>Inputkan nama lengkap dari kepala keluarga yang mendaftar.</Form.Description
					>
				</Form.Item>
			</Form.Field>
			<InputAlamat bind:alamat={$formStore.alamat_tinggal} class="py-1" />
			<Form.Field {config} name="marga">
				<Form.Item class="pt-3">
					<Form.Label>Marga</Form.Label>
					<InputMarga bind:value={$formStore.marga} />
				</Form.Item>
			</Form.Field>
			<Form.Field {config} name="tanggal_menikah">
				<Form.Item>
					<Form.Label>Tanggal Menikah</Form.Label>
					<Form.Input type="date" />
				</Form.Item>
			</Form.Field>
		</Card.Content>
	</Card.Root>
	<!-- DATA AKUN -->
	<Card.Root>
		<Card.Header>
			<Card.Title>Data Akun</Card.Title>
			<Card.Description>Inputkan data Akun</Card.Description>
		</Card.Header>
		<Card.Content class="space-y-2">
			<Form.Field {config} name="username">
				<Form.Item>
					<Form.Label>Username</Form.Label>
					<Form.Input placeholder="Masukkan username" autocomplete="username" />
				</Form.Item>
			</Form.Field>
			<Form.Field {config} name="password">
				<Form.Item>
					<Form.Label>Password</Form.Label>
					<Form.Input type="password" placeholder="******" autocomplete="new-password" />
				</Form.Item>
			</Form.Field>
			<Form.Field {config} name="password_konfirmasi">
				<Form.Item>
					<Form.Label>Konfirmasi Password</Form.Label>
					<Form.Input type="password" placeholder="******" autocomplete="new-password" />
				</Form.Item>
			</Form.Field>
		</Card.Content>
	</Card.Root>
	<Separator />
	<Form.Button class="w-full">Daftar</Form.Button>
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
