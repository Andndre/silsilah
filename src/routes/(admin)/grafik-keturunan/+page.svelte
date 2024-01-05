<script lang="ts">
	import { Canvas, Layer, type Render } from 'svelte-canvas';
	import type { Coords } from '$lib/types';
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	
	let screenWidth = 0;
	let screenHeight = 0;
	let canvasWidth = 0;
	let canvasHeight = 0;

	let isPanning = false;
	let lastMousePosition = { x: 0, y: 0 } as Coords;

	$: console.log(`isPaning: ${isPanning}`);
	$: console.log(`lastMousePosition: ${JSON.stringify(lastMousePosition)}`);

	let canvas: HTMLCanvasElement | null = null;
	onMount(() => {
		canvas = browser ? document.getElementsByTagName('canvas').item(0) : null;
	});

	const LG_SCREEN = 1024;
	const NAV_BAR_HEIGHT = 56.8;
	const MOBILE_SIDEBAR_HEIGHT = 60;
	const LG_SIDEBAR_WIDTH = 250;

	$: if (screenWidth < LG_SCREEN) {
		canvasWidth = screenWidth;
		canvasHeight = screenHeight - NAV_BAR_HEIGHT - MOBILE_SIDEBAR_HEIGHT;
	} else {
		canvasWidth = screenWidth - LG_SIDEBAR_WIDTH;
		canvasHeight = screenHeight - NAV_BAR_HEIGHT * 2;
	}

	let zoom = 1;
	let position = { x: 0, y: 0 };

	$: console.log(`zoom: ${zoom}`);
	$: console.log(`position: ${JSON.stringify(position)}`);

	let render: Render;
	$: {
		render = ({ context, width, height }) => {
			context.clearRect(0, 0, width, height);

			context.setTransform(zoom, 0, 0, zoom, position.x + width / 2, position.y + height / 2);

			context.beginPath();
			context.moveTo(0, 0);
			context.lineTo(200, 50);
			context.stroke();
		};
	}

	function onMouseDown(event: MouseEvent) {
		if (event.button === 1) {
			event.preventDefault();
			isPanning = true;
			lastMousePosition = { x: event.clientX, y: event.clientY };
			if (!canvas) return;
			canvas.style.cursor = 'grab';
		}
	}
	
	function onMouseMove(event: MouseEvent) {
		if (isPanning) {
			// Get the mouse movement
			const movementX = event.clientX - lastMousePosition.x;
			const movementY = event.clientY - lastMousePosition.y;
			
			// Update the position based on the mouse movement
			position.x += movementX;
			position.y += movementY;
		}
		
		lastMousePosition.x = event.clientX;
		lastMousePosition.y = event.clientY;
	}

	function onMouseUp(event: MouseEvent) {
		if (event.button === 1) {
			isPanning = false;
			if (!canvas) return;
			canvas.style.cursor = 'default';
		}
	}

	function onWheel(event: WheelEvent) {
		const zoomFactor = 1.1;
		const wheelDelta = event.deltaY;

		// Calculate the new zoom level
		if (wheelDelta > 0) {
			zoom /= zoomFactor;
		} else {
			zoom *= zoomFactor;
		}

		if (!canvas) {
			console.log('canvas not found');
			return;
		}

		// Get the mouse position relative to the canvas
		const rect = canvas.getBoundingClientRect();
		const mouseX = event.clientX - rect.left;
		const mouseY = event.clientY - rect.top;

		// Adjust the position to zoom in/out at the mouse position
		position.x -= (mouseX - position.x) * (zoomFactor - 1);
		position.y -= (mouseY - position.y) * (zoomFactor - 1);
	}
</script>

<svelte:window bind:innerWidth={screenWidth} bind:innerHeight={screenHeight} />

<div class="relative">
	<Canvas
		bind:width={canvasWidth}
		height={canvasHeight}
		class="max-w-full bg:white dark:bg-black"
		on:mousedown={onMouseDown}
		on:mousemove={onMouseMove}
		on:mouseup={onMouseUp}
		on:wheel={onWheel}
	>
		<Layer {render} />
	</Canvas>
	<Button on:click={() => {
		position = { x: 0, y: 0 };
		zoom = 1;
	}} class="absolute right-5 bottom-5">Reset zoom</Button>
</div>
