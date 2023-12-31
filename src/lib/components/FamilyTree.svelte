<script lang="ts">
	import { onMount, afterUpdate } from 'svelte';
	import type { FamilyNode } from '$lib/utils';
	import * as d3 from 'd3';

	export let textFontSize = 14;
	export let textPaddingX = 20;
	export let textPaddingY = 5;

	let svg: d3.Selection<SVGSVGElement, any, HTMLElement, any>;
	let g: d3.Selection<SVGGElement, any, HTMLElement, any>;
	let root: d3.HierarchyNode<FamilyNode>;
	let zoom: d3.ZoomBehavior<Element, any>;

	export let familyData: FamilyNode;

	onMount(() => {
		init();
	});

	afterUpdate(() => {
		update();
	});

	function init() {
		const width = 800;
		const height = 600;

		zoom = d3.zoom().scaleExtent([0.1, 3]).on('zoom', zoomed);

		// @ts-ignore
		svg = d3
			.select('#family-tree')
			.attr('width', width)
			.attr('height', height)
			// @ts-ignore
			.call(zoom);

		g = svg.append('g');

		root = d3.hierarchy(familyData);
		update();
	}

	function update() {
		const tree = d3
			.tree<FamilyNode>()
			.nodeSize([1, 60])
			.separation((a, b) => {
				const totalWidth = getNodeWidth(a.data) + getNodeWidth(b.data);
				return totalWidth / 2 + 20;
			});
		const hierarchy = tree(root);

		drawLinks(hierarchy);
		drawNodes(hierarchy);

		// Setelah nodes diupdate, atur ulang zoom untuk menampilkan semua nodes
		resetZoomToFit();
	}

	function drawNodes(hierarchy: d3.HierarchyPointNode<FamilyNode>) {
		const nodes = g
			.selectAll<SVGGElement, d3.HierarchyPointNode<FamilyNode>>('g')
			.data(hierarchy.descendants())
			.join('g')
			.attr('transform', (d) => `translate(${d.x},${d.y})`);

		nodes.each(function (d) {
			const node = d3.select(this);
			const nodeWidth = getNodeWidth(d.data);

			node.append('rect')
				.attr('x', -nodeWidth / 2)
				.attr('y', -15 - textPaddingY)
				.attr('width', nodeWidth)
				.attr('height', 30 + 2 * textPaddingY)
				.attr('fill', '#3498db')
				.attr('style', 'font-family: Consolas');

			node.append('text')
				// @ts-ignore
				.text((d) => d.data.name)
				.attr('fill', '#fff')
				.attr('x', 0)
				.attr('y', 0)
				.attr('dy', '0.35em')
				.style('text-anchor', 'middle')
				.attr('font-family', 'Consolas');
		});
	}

	function drawLinks(hierarchy: d3.HierarchyPointNode<FamilyNode>) {
		const links = g
			.selectAll<SVGPathElement, d3.HierarchyPointLink<FamilyNode>>('path')
			.data(hierarchy.links())
			.join('path')
			.attr('fill', 'none')
			.attr('stroke', '#3498db')
			.attr('stroke-width', 2)
			.attr('d', linkCurve);

		function linkCurve(d: any) {
			const sourceX = d.source.x!;
			const sourceY = d.source.y!;
			const targetX = d.target.x!;
			const targetY = d.target.y!;

			const intermediateY = sourceY + (targetY - sourceY) / 2;

			return `M${sourceX},${sourceY}V${intermediateY}H${targetX}V${targetY}`;
		}
	}

	function zoomed(event: d3.D3ZoomEvent<Element, any>) {
		// @ts-ignore
		g.attr('transform', event.transform);
	}

	function resetZoomToFit() {
		const bounds = g.node()?.getBBox(); // Dapatkan bounding box dari semua nodes
		if (bounds) {
			const parent = svg.node()?.parentElement;
			const fullWidth = parent?.clientWidth || 800; // Ganti dengan lebar yang diinginkan
			const fullHeight = parent?.clientHeight || 600; // Ganti dengan tinggi yang diinginkan

			const width = bounds.width;
			const height = bounds.height;
			const midX = bounds.x + width / 2;
			const midY = bounds.y + height / 2;

			if (width === 0 || height === 0) return; // Hindari pembagian oleh nol

			const scale = 0.85 / Math.max(width / fullWidth, height / fullHeight);
			const translate = [fullWidth / 2 - scale * midX, fullHeight / 2 - scale * midY];

			const transform = d3.zoomIdentity.translate(translate[0], translate[1]).scale(scale);
			// @ts-ignore
			svg.transition().duration(500).call(zoom.transform, transform);
		}
	}

	function getNodeWidth(node: FamilyNode) {
		const textWidth = getTextWidth(node.name, textFontSize);
		return textWidth + 2 * textPaddingX;
	}

	function getTextWidth(text: string, fontSize: number) {
		const div = document.createElement('text');
		div.style.position = 'absolute';
		div.style.visibility = 'hidden';
		div.style.font = `${fontSize}px Consolas`;
		div.textContent = text;
		document.body.appendChild(div);
		const width = div.clientWidth;
		document.body.removeChild(div);
		return width;
	}
</script>

<button on:click={resetZoomToFit}>Reset Zoom</button>

<svg id="family-tree"></svg>

<style>
	svg {
		overflow: hidden;
	}

	button {
		position: absolute;
		top: 10px;
		left: 10px;
		z-index: 1;
	}
</style>
