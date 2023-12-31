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

	export let form: SuperValidated<FormSchema>;
	export let pilihanAgama: InferSelectModel<typeof agama>[];

	let alertOpen = false;

	const theForm = superForm(form, {
		validators: formSchema,
		taintedMessage: null,
		onError: ({ message }) => {
			console.log(message);
			alertOpen = true;
		},
	});
	const { form: formStore } = theForm;
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
			<Form.Field {config} name="suami_nama">
				<Form.Item>
					<Form.Label>Nama</Form.Label>
					<Form.Input placeholder="Nama lengkap" />
					<Form.Validation />
				</Form.Item>
			</Form.Field>
			<Form.Field {config} name="suami_tempat_lahir">
				<Form.Item>
					<Form.Label>Tempat Lahir</Form.Label>
					<Form.Input class="hidden" placeholder="Tempat lahir" />
					<Form.Validation />
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
					<Form.Validation />
				</Form.Item>
			</Form.Field>
			<Form.Field {config} name="suami_tanggal_lahir">
				<Form.Item>
					<Form.Label>Tanggal Lahir</Form.Label>
					<Form.Input type="date" />
					<Form.Validation />
				</Form.Item>
			</Form.Field>
		</Card.Content>
	</Card.Root>
	<!-- DATA IBU -->
	<Card.Root>
		<Card.Header>
			<Card.Title>Data Ibu</Card.Title>
			<Card.Description>Inputkan data Ibu</Card.Description>
		</Card.Header>
		<Card.Content class="space-y-2">
			<Form.Field {config} name="istri_nama">
				<Form.Item>
					<Form.Label>Nama</Form.Label>
					<Form.Input placeholder="Nama lengkap" />
					<Form.Validation />
				</Form.Item>
			</Form.Field>
			<Form.Field {config} name="istri_tempat_lahir">
				<Form.Item>
					<Form.Label>Tempat Lahir</Form.Label>
					<Form.Input class="hidden" placeholder="Tempat lahir" />
					<Form.Validation />
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
								<Form.SelectItem bind:value={agama.id}>{agama.nama}</Form.SelectItem
								>
							{/each}
						</Form.SelectContent>
					</Form.Select>
					<Form.Validation />
				</Form.Item>
			</Form.Field>
			<Form.Field {config} name="istri_tanggal_lahir">
				<Form.Item>
					<Form.Label>Tanggal Lahir</Form.Label>
					<Form.Input type="date" />
					<Form.Validation />
				</Form.Item>
			</Form.Field>
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
					<Form.Validation />
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
					<Form.Validation />
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
					<Form.Validation />
				</Form.Item>
			</Form.Field>
			<Form.Field {config} name="password">
				<Form.Item>
					<Form.Label>Password</Form.Label>
					<Form.Input type="password" placeholder="******" autocomplete="new-password" />
					<Form.Validation />
				</Form.Item>
			</Form.Field>
			<Form.Field {config} name="password_konfirmasi">
				<Form.Item>
					<Form.Label>Konfirmasi Password</Form.Label>
					<Form.Input type="password" placeholder="******" autocomplete="new-password" />
					<Form.Validation />
				</Form.Item>
			</Form.Field>
		</Card.Content>
	</Card.Root>
	<Separator />
	<Form.Button>Daftar</Form.Button>
</Form.Root>

<AlertDialog.Root open={alertOpen}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Maaf</AlertDialog.Title>
			<AlertDialog.Description>
				Terjadi kesalahan yang tidak diduga, harap coba lagi nanti
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel>Baik</AlertDialog.Cancel>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
