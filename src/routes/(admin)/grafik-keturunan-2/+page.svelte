<script lang="ts">
	import type { FamilyTreeSchema } from '$lib/types';
	import { onMount } from 'svelte';
	import Connections from './Connections.svelte';
	import Node from './Node.svelte';

	const familyTreeData: FamilyTreeSchema = {
		type: 'parent',
		namaAyah: "John Doe",
		namaIbu: "Jane Doe",
		tahunLahirAyah: "1970",
		tahunLahirIbu: "1975",
		fotoAyah: "url_foto_ayah",
		fotoIbu: "url_foto_ibu",
		children: [
			{
				type: 'child',
				nama: "Child 1",
				tahunLahir: "2000",
				foto: "url_foto_child1",
			},
			{
				type: 'parent',
				namaAyah: "John Doe",
				namaIbu: "Jane Doe",
				tahunLahirAyah: "1970",
				tahunLahirIbu: "1975",
				fotoAyah: "url_foto_ayah",
				fotoIbu: "url_foto_ibu",
				children: [
					{
						type: 'child',
						nama: "Grandchild 1",
						tahunLahir: "2025",
						foto: "url_foto_grandchild1",
					},
					{
						type: 'child',
						nama: "Grandchild 1",
						tahunLahir: "2025",
						foto: "url_foto_grandchild1",
					},
				],
			},
			{
				type: 'child',
				nama: "Hello world asa sdas fsd dasads",
				tahunLahir: "2010",
				foto: "url_foto_child3",
			},
			{
				type: 'child',
				nama: "Child 3",
				tahunLahir: "2010",
				foto: "url_foto_child3",
			},
			{
				type: 'child',
				nama: "Child 3",
				tahunLahir: "2010",
				foto: "url_foto_child3",
			},
			{
				type: 'child',
				nama: "Child 3",
				tahunLahir: "2010",
				foto: "url_foto_child3",
			},
			{
				type: 'child',
				nama: "Child 3",
				tahunLahir: "2010",
				foto: "url_foto_child3",
			},
			{
				type: 'child',
				nama: "Child 3",
				tahunLahir: "2010",
				foto: "url_foto_child3",
			},
			{
				type: 'child',
				nama: "Child 3",
				tahunLahir: "2010",
				foto: "url_foto_child3",
			},
		],
	};

	onMount(() => {
		let pos = { top: 0, left: 0, x: 0, y: 0 };
		let zoom = 1;
		const ZOOM_SPEED = 0.1;
		const container = document.getElementById('grafik-container') as HTMLDivElement;
		const allElementContainer = document.getElementById('all-element') as HTMLDivElement;
		
		const mouseDownHandler = function(e: MouseEvent) {
			if(e.button === 1) {
				e.preventDefault();
			}
			container.style.cursor = 'grabbing';
			container.style.userSelect = 'none';
			pos = {
        left: container.scrollLeft,
        top: container.scrollTop,
        x: e.clientX,
        y: e.clientY,
			};

			document.addEventListener('mousemove', mouseMoveHandler);
			document.addEventListener('mouseup', mouseUpHandler);
		};
		const mouseMoveHandler = function (e: MouseEvent) {
			const dx = e.clientX - pos.x;
			const dy = e.clientY - pos.y;

			container.scrollTop = pos.top - dy;
			container.scrollLeft = pos.left - dx;
		};
		const mouseUpHandler = function () {
			container.style.removeProperty('user-select');
			document.removeEventListener('mousemove', mouseMoveHandler);
			document.removeEventListener('mouseup', mouseUpHandler);
			container.style.cursor = 'grab';
		};
		const mouseWheelHandler = (e: WheelEvent) => {
			e.preventDefault();
			if (!e.ctrlKey) return;
			const mouseX = e.clientX - container.getBoundingClientRect().left;
			const mouseY = e.clientY - container.getBoundingClientRect().top;
			if (e.deltaY > 0) {
				zoom -= ZOOM_SPEED;
			} else {
				zoom += ZOOM_SPEED;
			}
			allElementContainer.style.transform = `scale(${zoom})`;
			allElementContainer.style.transformOrigin = `${mouseX}px ${mouseY}px`;
		};
		
		container.addEventListener('mousedown', mouseDownHandler);
		container.addEventListener('wheel', mouseWheelHandler);
	});

</script>

<div id="grafik-container" class="relative grid items-center p-10 max-h-[calc(100vh-120px)] lg:max-w-[calc(100vw-260px)] max-w-[calc(100vw-10px)] overflow-x-scroll bg-white" style="background-image: radial-gradient(rgb(200,200,200) 2px, transparent 0); background-position: -19px -19px; background-size: 40px 40px;">
	<div id="all-element" >
		<Node schema={familyTreeData} />
		<Connections />
	</div>
</div>
