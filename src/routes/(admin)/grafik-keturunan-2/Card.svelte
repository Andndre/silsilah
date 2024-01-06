<script lang="ts">
	import { cn } from "$lib/utils";
	import type { HTMLBaseAttributes } from "svelte/elements";

	export let image: string;
	export let nama: string;
	export let tanggalLahir: string;

	let className: HTMLBaseAttributes['class'] = undefined;
	export { className as class };
</script>

<div class={cn("p-2 rounded-2xl border-2 border-black bg-white flex items-center w-max", className)}>
	<img src="{image}" alt="Picture of {nama}" class="w-24 h-24 object-cover object-center rounded-lg mr-3">
	<div>
			<span class="inline-block font-semibold mr-2 text-nowrap">{nama}</span><br>
			<span class="inline-block text-gray-500 mr-2 text-nowrap">{tanggalLahir}</span>
	</div>
</div>
