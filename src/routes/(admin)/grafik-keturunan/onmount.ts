import { browser } from "$app/environment";

export const onMountHandler = () => {
	if (!browser) return;
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
}