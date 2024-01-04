<script lang="ts">
	import { Canvas, Layer, type Render, type CanvasLayerEvent } from 'svelte-canvas';
  import { tweened } from 'svelte/motion';
  import { quadOut as easing } from 'svelte/easing';

  const position = tweened([0.5, 0.5], { duration: 400, easing });

  setInterval(() => {
    position.set([Math.random(), Math.random()]);
  }, 500);

	let render: Render;
  $: {
		render = ({ context, width, height }) => {
			const [x, y] = $position;
			context.fillStyle = 'tomato';
			context.beginPath();
			context.arc(x * width, y * height, 20, 0, 2 * Math.PI);
			context.fill();
  	};
	}
</script>

<Canvas width={1920} height={1080} class="w-full bg-black">
	<Layer {render} />
</Canvas>
