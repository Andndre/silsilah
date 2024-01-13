<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import * as Select from '$lib/components/ui/select';

	import type { FamilyTreeSchema } from '$lib/types';
	import { onMount } from 'svelte';
	import { onMountHandler } from './onmount';
	import { Label } from '$lib/components/ui/label';
	import { Button } from '$lib/components/ui/button';
	import { ChevronsLeft } from 'lucide-svelte';
	import { cn } from '$lib/utils';
	import { fly } from 'svelte/transition';
	import { quadInOut } from 'svelte/easing';

	import Node from './Node.svelte';
	import html2canvas from 'html2canvas';

	const familyTreeData: FamilyTreeSchema = {
		type: 'parent',
		namaAyah: 'John Doe',
		namaIbu: 'Jane Doe',
		tahunLahirAyah: '1970',
		tahunLahirIbu: '1975',
		fotoAyah: 'url_foto_ayah',
		fotoIbu: 'url_foto_ibu',
		id: '1',
		children: [
			{
				type: 'child',
				nama: 'Child 1',
				tahunLahir: '2000',
				foto: 'url_foto_child1',
				id: '2',
			},
			{
				type: 'parent',
				namaAyah: 'John Doe',
				namaIbu: 'Jane Doe',
				tahunLahirAyah: '1970',
				tahunLahirIbu: '1975',
				fotoAyah: 'url_foto_ayah',
				fotoIbu: 'url_foto_ibu',
				id: '7',
				children: [
					{
						type: 'child',
						nama: 'Grandchild 1',
						tahunLahir: '2025',
						foto: 'url_foto_grandchild1',
						id: '3',
					},
					{
						type: 'child',
						nama: 'Grandchild 1',
						tahunLahir: '2025',
						foto: 'url_foto_grandchild1',
						id: '4',
					},
				],
			},
			{
				type: 'child',
				nama: 'Hello world asa sdas fsd dasads',
				tahunLahir: '2010',
				foto: 'url_foto_child3',
				id: '5',
			},
			{
				type: 'child',
				nama: 'Child 3',
				tahunLahir: '2010',
				foto: 'url_foto_child3',
				id: '6',
			},
		],
	};

	const options = [
		{
			value: 'keluarga_ini',
			label: 'Keluarga ini Saja',
		},
		{
			value: 'leluhur',
			label: 'Leluhur keluarga ini',
		},
		{
			value: 'lengkap',
			label: 'Lengkap',
		},
	];

	let openOption = false;

	function saveImage() {
		const element = document.getElementById('all-element') as HTMLDivElement;
		html2canvas(element, {
			logging: true,
		}).then((canvas) => {
			let myImage = canvas.toDataURL();
			downloadURI(myImage, 'MaSimulation.png');
		});
	}

	function downloadURI(uri: string, name: string) {
		let link = document.createElement('a');
		link.download = name;
		link.href = uri;
		document.body.appendChild(link);
		link.click();
	}

	onMount(onMountHandler);
</script>

<div class="relative">
	<div
		id="grafik-container"
		class="relative grid items-center p-10 max-h-[calc(100vh-120px)] lg:max-w-[calc(100vw-260px)] max-w-[calc(100vw-10px)] overflow-x-scroll bg-white"
		style="background-image: radial-gradient(rgb(200,200,200) 2px, transparent 0); background-position: -19px -19px; background-size: 40px 40px;"
	>
		<div id="all-element">
			<Node class="select-none" schema={familyTreeData} />
		</div>
	</div>
	<div class="absolute top-5 left-5 flex gap-2">
		{#if openOption}
			<div transition:fly={{ duration: 400, x: -200, easing: quadInOut }}>
				<Card.Root class="w-[280px]">
					<Card.Header>
						<Card.Title>Opsi cetak</Card.Title>
						<Card.Description>Pilih bagaimana gambar akan dihasilkan.</Card.Description>
					</Card.Header>
					<Card.Content>
						<form>
							<div class="grid w-full items-center gap-4">
								<div class="flex flex-col space-y-1.5">
									<Label for="opsi">Opsi</Label>
									<Select.Root selected={options[0]}>
										<Select.Trigger id="opsi">
											<Select.Value placeholder="Select" />
										</Select.Trigger>
										<Select.Content>
											{#each options as op}
												<Select.Item value={op.value} label={op.label}
													>{op.label}</Select.Item
												>
											{/each}
										</Select.Content>
									</Select.Root>
								</div>
							</div>
						</form>
					</Card.Content>
					<Card.Footer class="flex justify-between">
						<Button on:click={saveImage} variant="default">Cetak PNG</Button>
					</Card.Footer>
				</Card.Root>
			</div>
		{/if}
		<Button
			variant="outline"
			class="w-12 h-12"
			on:click={() => {
				openOption = !openOption;
			}}
			><ChevronsLeft
				class={cn('w-4 h-4 transition-transform duration-300', openOption || 'rotate-180')}
			/></Button
		>
	</div>
</div>
