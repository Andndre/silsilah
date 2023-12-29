<script lang="ts">
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
	export let form: SuperValidated<FormSchema>;

	const df = new DateFormatter('en-US', {
		dateStyle: 'long'
	});

	const theForm = superForm(form, {
		validators: formSchema,
		taintedMessage: null
	});

	const { form: formStore } = theForm;
	export let pilihanAgama: InferSelectModel<typeof agama>[];

	let placeholder: DateValue = today(getLocalTimeZone());
	let margas: InferSelectModel<typeof marga>[] = [];

	let searching = false;

	let buatMargaFormVisible = false;
	let inputMargaSearch = '';

	let margaDialogOpen: boolean;
	let inputMargaBaru = '';
	let inputKeteranganMargaBaru = '';
	let prosesBuatMarga = false;

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
		if (prosesBuatMarga) return;
		prosesBuatMarga = true;

		const result = await fetch(`/api/marga`, {
			method: 'POST',
			body: JSON.stringify({
				nama: inputMargaBaru,
				keterangan: inputKeteranganMargaBaru
			})
		});

		if (result.ok) {
			buatMargaFormVisible = false;
			inputMargaSearch = inputMargaBaru;
			inputMargaBaru = '';
			inputKeteranganMargaBaru = '';
			searchMarga();
		}
	}
</script>

<Form.Root method="POST" controlled form={theForm} schema={formSchema} let:config>
	<Form.Field {config} name="nama_kepala_keluarga">
		<Form.Item>
			<Form.Label>Nama Kepala Keluarga</Form.Label>
			<Form.Input />
			<Form.Description>Inputkan nama lengkap dari kepala keluarga yang mendaftar.</Form.Description
			>
			<Form.Validation />
		</Form.Item>
	</Form.Field>
	<Form.Field {config} name="nik">
		<Form.Item>
			<Form.Label>NIK Anda</Form.Label>
			<Form.Input />
			<Form.Description
				>Silakan inputkan NIK Anda. (<span class="text-red-500">PERHATIAN!</span> NIK ini akan dienkripsi
				saat disimpan sehingga pengambang dan pihak lain tidak bisa melihat ini)</Form.Description
			>
			<Form.Validation />
		</Form.Item>
	</Form.Field>
	<Form.Field {config} name="no_kk">
		<Form.Item>
			<Form.Label>Nomor Kartu Keluarga</Form.Label>
			<Form.Input />
			<Form.Description
				>Silakan inputkan Nomor Kartu Keluarga Anda. (<span class="text-red-500">PERHATIAN!</span> Ini
				akan menjadi pembeda untuk setiap keluarga yang mendaftar)</Form.Description
			>
			<Form.Validation />
		</Form.Item>
	</Form.Field>
	<Form.Field {config} name="status">
		<Form.Item>
			<Form.Label>Status Anda</Form.Label>
			<Form.Select>
				<Form.SelectTrigger placeholder="Pilih status" />
				<Form.SelectContent>
					<Form.SelectItem value="suami">Suami</Form.SelectItem>
					<Form.SelectItem value="istri">Istri</Form.SelectItem>
				</Form.SelectContent>
			</Form.Select>
			<Form.Description>Status anda dalam keluarga</Form.Description>
			<Form.Validation />
		</Form.Item>
	</Form.Field>
	<Form.Field {config} name="agama">
		<Form.Item>
			<Form.Label>Agama Anda</Form.Label>
			<Form.Select>
				<Form.SelectTrigger placeholder="Pilih agama" />
				<Form.SelectContent>
					{#each pilihanAgama as agama}
						<Form.SelectItem value={agama.nama}>{agama.nama}</Form.SelectItem>
					{/each}
				</Form.SelectContent>
			</Form.Select>
			<Form.Description>Silakan masukkan agama Anda selaku kepala keluarga</Form.Description>
			<Form.Validation />
		</Form.Item>
	</Form.Field>
	<Form.Field {config} name="tanggal_lahir">
		<Form.Item>
			<Form.Label>Tanggal Lahir</Form.Label>
			<Form.Input type="date" />
			<Form.Description>Silahkan masukkan tanggal lahir Anda</Form.Description>
			<Form.Validation />
		</Form.Item>
	</Form.Field>
	<hr class="my-4" />
	<Form.Field {config} name="is_turunan">
		<Form.Item class="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
			<Form.Checkbox />
			<div class="space-y-1 leading-none">
				<Form.Label>Apakah leluhur Anda sudah memiliki akun?</Form.Label>
				<Form.Description
					>Jika leluhur Anda sudah memiliki akun, akun ini akan ditambahkan ke keluarga leluhur Anda
					apabila disetujui oleh pemegang akun leluhur Anda</Form.Description
				>
				<Form.Validation />
			</div>
		</Form.Item>
	</Form.Field>
	{#if $formStore.is_turunan}
		<Form.Field {config} name="no_kk">
			<Form.Item class="pt-3">
				<Form.Label>Undangan</Form.Label>
				<Form.Input />
				<Form.Description>Silahkan masukkan kode undangan</Form.Description>
				<Form.Validation />
			</Form.Item>
		</Form.Field>
	{:else}
		<Form.Field {config} name="id_marga">
			<Form.Item class="pt-3">
				<Form.Label>Marga</Form.Label>
				<div class="flex gap-3 flex-col items-start md:flex-row md:items-center">
					<Form.Input placeholder="Masukkan kode marga" bind:value={$formStore.id_marga} />
					<span class="text-muted-foreground">atau</span>
					<Dialog.Root bind:open={margaDialogOpen}>
						<Dialog.Trigger>
							<Button
								variant="outline"
								on:click={() => {
									$formStore.id_marga = '';
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
								{#each margas as marga}
									<button
										class="contents"
										on:click={() => {
											$formStore.id_marga = marga.id;
											margaDialogOpen = false;
										}}
									>
										<div class="flex flex-col items-start space-y-3 rounded-md border p-4 text-sm">
											<h3 class="text-base font-semibold">{marga.nama}</h3>
											<p class="text-muted-foreground text-sm">{marga.keterangan}</p>
										</div>
									</button>
								{:else}
									{#if buatMargaFormVisible}
										<div class="flex flex-col items-start space-y-3 rounded-md border p-4 text-sm">
											<h3 class="text-base font-semibold">Buat Marga Baru</h3>
											<Input placeholder="Masukkan nama marga" bind:value={inputMargaBaru} />
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
				<Form.Description>Kode marga keluarga Anda</Form.Description>
			</Form.Item>
		</Form.Field>
	{/if}
	<hr class="my-4" />
	<Form.Button>Daftar</Form.Button>
</Form.Root>
