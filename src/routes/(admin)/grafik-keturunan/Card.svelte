<script lang="ts">
	import { cn } from "$lib/utils";
	import type { HTMLBaseAttributes } from "svelte/elements";

	export let image: string;
	export let nama: string;
	export let tanggalLahir: string;
	export let id: string;

	let className: HTMLBaseAttributes['class'] = undefined;
	export let asChild = false;
	export { className as class };
</script>

<div {id} class={cn("p-2 rounded-2xl border-2 border-black bg-white flex items-center w-max card", className, asChild ? 'connector-top-child' : '')}>
	<div class="contents">
		<img src="{image}" alt="Picture of {nama}" class="w-24 h-24 object-cover object-center rounded-lg mr-3 pointer-events-none">
		<div>
			<span class="inline-block font-semibold mr-2 text-nowrap">{nama}</span><br>
			<span class="inline-block text-gray-500 mr-2 text-nowrap">{tanggalLahir}</span>
		</div>
	</div>
</div>
