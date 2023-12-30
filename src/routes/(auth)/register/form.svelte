<script lang="ts">
	import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';
	import * as Form from '$lib/components/ui/form';
	import type { SuperValidated } from 'sveltekit-superforms';
	import { formSchema, type FormSchema } from './schema';
	import FormSelect from '$lib/components/ui/form/form-select.svelte';
	import { Calendar as CalendarIcon } from 'lucide-svelte';
	import {
		type DateValue,
		DateFormatter,
		getLocalTimeZone,
		parseDate,
		CalendarDate,
		today
	} from '@internationalized/date';
	import { cn } from '$lib/utils';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import { Calendar } from '$lib/components/ui/calendar';
	import * as Popover from '$lib/components/ui/popover';
	import * as Dialog from '$lib/components/ui/dialog';
	import { superForm } from 'sveltekit-superforms/client';
	import type { agama, marga } from '$lib/schema';
	import type { InferSelectModel } from 'drizzle-orm';
	import Input from '$lib/components/ui/input/input.svelte';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';
	import * as Card from '$lib/components/ui/card';
	import InputAlamat from '$lib/components/InputAlamat.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';

	export let form: SuperValidated<FormSchema>;
	export let pilihanAgama: InferSelectModel<typeof agama>[];
	let placeholder: DateValue = today(getLocalTimeZone());
	let margas: InferSelectModel<typeof marga>[] = [];
	let searching = false;
	let buatMargaFormVisible = false;
	let inputMargaSearch = '';
	let margaDialogOpen: boolean;
	let inputKeteranganMargaBaru = '';
	let prosesBuatMarga = false;
	let alertOpen = false;

	const theForm = superForm(form, {
		validators: formSchema,
		taintedMessage: null,
		onError: ({ message }) => {
			console.log(message);
			alertOpen = true;
		}
	});
	const { form: formStore, errors } = theForm;

	async function searchMarga() {
		if (searching) return;
		searching = true;

		const result = await fetch(`/api/marga-by-name`, {
			method: 'POST',
			body: JSON.stringify({ name: inputMargaSearch })
		});
		if (result.ok) {
			const json = await result.json();
			if (json) {
				margas = json as InferSelectModel<typeof marga>[];
			}
		}
		searching = false;
	}

	async function buatMarga() {
		if (prosesBuatMarga) {
			console.log('proses buat marga sedang berlangsung');
			return;
		}
		prosesBuatMarga = true;

		const result = await fetch(`/api/marga`, {
			method: 'POST',
			body: JSON.stringify({
				nama: inputMargaSearch,
				keterangan: inputKeteranganMargaBaru
			})
		});

		if (result.ok) {
			buatMargaFormVisible = false;
			inputKeteranganMargaBaru = '';
			searchMarga();
		}
	}
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
								<Form.SelectItem bind:value={agama.id}>{agama.nama}</Form.SelectItem>
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
					<div class="flex gap-3 flex-col items-start md:flex-row md:items-center">
						<Form.Input placeholder="Masukkan kode marga" bind:value={$formStore.marga} />
						<span class="text-muted-foreground">atau</span>
						<Dialog.Root bind:open={margaDialogOpen}>
							<Dialog.Trigger>
								<Button
									variant="outline"
									on:click={() => {
										$formStore.marga = 0;
									}}>Cari Marga</Button
								>
							</Dialog.Trigger>
							<Dialog.Content>
								<Dialog.Header class={cn(buatMargaFormVisible && 'opacity-50')}>
									<Dialog.Title>Cari Marga</Dialog.Title>
									<Dialog.Description>Silahkan masukkan nama marga Anda</Dialog.Description>
								</Dialog.Header>
								{#if !buatMargaFormVisible}
									<Input
										placeholder="Nama Marga"
										bind:value={inputMargaSearch}
										on:input={searchMarga}
									/>
									<hr />
									<strong class="text-sm">Hasil pencarian:</strong>
								{/if}
								<div class="flex flex-col gap-3">
									{#each margas as marga, index}
										<button
											class="contents"
											on:click={() => {
												$formStore.marga = marga.id;
												margaDialogOpen = false;
											}}
										>
											<div
												class="flex flex-col items-start space-y-3 rounded-md border bg-primary/10 p-4 text-sm"
											>
												<h3 class="text-base font-semibold">{marga.nama}</h3>
												<p class="text-muted-foreground text-sm">{marga.keterangan}</p>
											</div>
										</button>
									{:else}
										{#if buatMargaFormVisible}
											<div
												class="flex flex-col items-start space-y-3 rounded-md border p-4 text-sm"
											>
												<h3 class="text-base font-semibold">Buat Marga Baru</h3>
												<Input placeholder="Masukkan nama marga" bind:value={inputMargaSearch} />
												<Textarea placeholder="Keterangan" bind:value={inputKeteranganMargaBaru}
												></Textarea>
												<div class="flex gap-3">
													<Button variant="default" on:click={() => buatMarga()}>Buat</Button>
													<Button variant="outline" on:click={() => (buatMargaFormVisible = false)}>
														Batal
													</Button>
												</div>
											</div>
										{:else}
											<div
												class="flex flex-col items-center justify-center space-y-3 rounded-md border p-4 text-sm h-40"
											>
												<span class="font-bold">Tidak menemukan marga?</span>
												<Button variant="default" on:click={() => (buatMargaFormVisible = true)}
													>Buat Marga Baru</Button
												>
											</div>
										{/if}
									{/each}
								</div>
							</Dialog.Content>
						</Dialog.Root>
					</div>
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
					<Form.Input placeholder="Masukkan username" />
					<Form.Validation />
				</Form.Item>
			</Form.Field>
			<Form.Field {config} name="password">
				<Form.Item>
					<Form.Label>Password</Form.Label>
					<Form.Input type="password" placeholder="******" />
					<Form.Validation />
				</Form.Item>
			</Form.Field>
			<Form.Field {config} name="password_konfirmasi">
				<Form.Item>
					<Form.Label>Konfirmasi Password</Form.Label>
					<Form.Input type="password" placeholder="******" />
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
