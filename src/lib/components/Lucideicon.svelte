<script>
	import * as icons from 'lucide-svelte';
	// @ts-ignore
	export let name;
	// @ts-ignore
	let icon = icons[name];
</script>

<svelte:component this={icon} {...$$props} />
