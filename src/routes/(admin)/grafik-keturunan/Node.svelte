<script lang="ts">
	import type { FamilyTreeSchema } from '$lib/types';
	import type { HTMLBaseAttributes } from 'svelte/elements';

	import Card from './Card.svelte';
	import { cn } from '$lib/utils';

	export let schema: FamilyTreeSchema;
	export let asChild: boolean = false;

	const idParent = schema.id;

	let className: HTMLBaseAttributes['class'] = undefined;
	export { className as class };
</script>

<div
	id={idParent}
	class={cn('flex flex-col gap-20 relative node', className)}
	style="align-items: safe center;"
>
	<!-- Parent node -->
	<div
		class={cn(
			'p-2 rounded-3xl border-2 border-black bg-gray-200 flex flex-col items-center gap-2',
			asChild ? 'connector-top' : '',
			schema.children.length > 0 ? 'connector-bottom' : '',
		)}
	>
		<div class={cn('contents', schema.children.length > 0 ? 'connector-line-bottom' : '')}>
			<Card
				id={`${idParent}-ayah`}
				class="w-full"
				nama={schema.namaAyah}
				image="https://media.sproutsocial.com/uploads/2022/06/profile-picture.jpeg"
				tanggalLahir={schema.tahunLahirAyah}
			/>
			<Card
				id={`${idParent}-ibu`}
				class="w-full"
				nama={schema.namaIbu}
				image="https://media.sproutsocial.com/uploads/2022/06/profile-picture.jpeg"
				tanggalLahir={schema.tahunLahirIbu}
			/>
		</div>
	</div>
	<!-- Children node -->
	<ul class="flex gap-2">
		{#each schema.children as child}
			{#if child.type === 'child'}
				<li>
					<Card
						id={`${child.id}`}
						asChild={true}
						nama={child.nama}
						image="https://media.sproutsocial.com/uploads/2022/06/profile-picture.jpeg"
						tanggalLahir={child.tahunLahir}
					/>
				</li>
			{:else}
				<li>
					<svelte:self schema={child} asChild={true} />
				</li>
			{/if}
		{/each}
	</ul>
</div>
