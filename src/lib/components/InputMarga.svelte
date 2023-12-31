<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';

	import type { marga } from '$lib/schema';
	import type { InferSelectModel } from 'drizzle-orm';
	import { cn } from '$lib/utils';

	let margas: InferSelectModel<typeof marga>[] = [];
	let searching = false;
	let buatMargaFormVisible = false;
	let inputMargaSearch = '';

	let margaDialogOpen: boolean;
	let inputKeteranganMargaBaru = '';
	let prosesBuatMarga = false;

	export let value: number;

	async function searchMarga() {
		if (searching) return;
		searching = true;

		const result = await fetch(`/api/marga-by-name`, {
			method: 'POST',
			body: JSON.stringify({ name: inputMargaSearch }),
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
				keterangan: inputKeteranganMargaBaru,
			}),
		});

		if (result.ok) {
			buatMargaFormVisible = false;
			inputKeteranganMargaBaru = '';
			searchMarga();
		}
	}
</script>

<div class="flex gap-3 flex-col items-start md:flex-row md:items-center">
	<Form.Input placeholder="Masukkan kode marga" bind:value />
	<span class="text-muted-foreground">atau</span>
	<Dialog.Root bind:open={margaDialogOpen}>
		<Dialog.Trigger>
			<Button
				variant="outline"
				on:click={() => {
					value = 0;
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
							value = marga.id;
							margaDialogOpen = false;
						}}
					>
						<div
							class="flex flex-col items-start space-y-3 rounded-md border bg-primary/10 p-4 text-sm"
						>
							<h3 class="text-base font-semibold">
								{marga.nama}
							</h3>
							<p class="text-muted-foreground text-sm">
								{marga.keterangan}
							</p>
						</div>
					</button>
				{:else}
					{#if buatMargaFormVisible}
						<div
							class="flex flex-col items-start space-y-3 rounded-md border p-4 text-sm"
						>
							<h3 class="text-base font-semibold">Buat Marga Baru</h3>
							<Input
								placeholder="Masukkan nama marga"
								bind:value={inputMargaSearch}
							/>
							<Textarea placeholder="Keterangan" bind:value={inputKeteranganMargaBaru}
							></Textarea>
							<div class="flex gap-3">
								<Button variant="default" on:click={() => buatMarga()}>Buat</Button>
								<Button
									variant="outline"
									on:click={() => (buatMargaFormVisible = false)}
								>
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
