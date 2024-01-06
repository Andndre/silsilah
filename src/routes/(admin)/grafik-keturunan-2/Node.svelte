<script lang="ts">
	import type { FamilyTreeSchema } from "$lib/types";
	import type { HTMLBaseAttributes } from "svelte/elements";

	import Card from "./Card.svelte";
	import { cn } from "$lib/utils";
	export let schema: FamilyTreeSchema;

	const idParent = schema.namaAyah.toLowerCase().replaceAll(' ', '-');

	let className: HTMLBaseAttributes['class'] = undefined;
	export { className as class };
</script>

<div id="{idParent}" class={cn("flex flex-col gap-20", className)} style="align-items: safe center;">
	<!-- Parent node -->
	<div class="p-2 rounded-3xl border-2 border-black bg-gray-400 flex flex-col items-center gap-2">
		<Card
			class="w-full"
			nama={schema.namaAyah}
			image="https://media.sproutsocial.com/uploads/2022/06/profile-picture.jpeg"
			tanggalLahir={schema.tahunLahirAyah}
		/>
		<Card
			class="w-full"
			nama={schema.namaIbu}
			image="https://media.sproutsocial.com/uploads/2022/06/profile-picture.jpeg"
			tanggalLahir={schema.tahunLahirIbu}
		/>
	</div>
	<!-- Children node -->
	<ul class="flex gap-2">
		{#each schema.children as child}
			 {#if child.type === 'child'}
				<li>
					<Card
						nama={child.nama}
						image="https://media.sproutsocial.com/uploads/2022/06/profile-picture.jpeg"
						tanggalLahir={child.tahunLahir}
					/>
				</li>
			 {:else}
				<li>
					<svelte:self schema={child} />
				</li>
			 {/if}
		{/each}
	</ul>
</div>
