import type { Circle, FamilyNode, Plane2D, RoundedPhoto, RoundedPlane2D, Size2D, Text } from '$lib/types';

export function drawChildNode(node: FamilyNode, ctx: CanvasRenderingContext2D, drawImage: boolean) {
	const cardWidth = 300;
	const cardHeight = 80;

	// Draw rounded card
	roundedRectagle(
		{
			...node,
			radius: 10,
			height: cardHeight,
			width: cardWidth,
		},
		ctx,
	);

	const padding = 5;

	if (drawImage) {
		roundedImage(
			{
				x: node.x + padding,
				y: node.y + padding,
				height: cardHeight - 2 * padding,
				width: cardHeight - 2 * padding,
				radius: 5,
				photoUrl: node.photoUrl,
			},
			ctx,
		);
	}

	const spaceTakenOnLeft = cardHeight;

	// Draw name
	const titleSize = 12;

	text({
		text: node.name,
		color: '#000',
		size: titleSize,
		style: 'bold',
		x: node.x + spaceTakenOnLeft + padding,
		y: node.y + padding * 3
	}, ctx);

	// Draw birth date
	text({
		text: node.birthDate,
		color: 'rgba(0, 0, 0, 0.5)',
		size: 10,
		style: 'italic',
		x: node.x + spaceTakenOnLeft + padding,
		y: node.y + padding * 4 + titleSize
	}, ctx);

	// Returning the card plane2d
	return {
		width: cardWidth,
		height: cardHeight,
		x: node.x,
		y: node.y
	} as Plane2D;
}

export function scatterDots(size: Size2D, ctx: CanvasRenderingContext2D) {
	ctx.save();
	ctx.fillStyle = 'rgba(0.5, 0.5, 0.5, 0.05)'
	for (let row = 0; row <= size.height; row += 50) {
		for(let col = 0; col <= size.width; col += 50) {
			drawCircle({
				x: col,
				y: row,
				radius: 5
			}, ctx);
		}
	}
	ctx.restore();
}

export function text(t: Text, ctx: CanvasRenderingContext2D) {
	ctx.save();
	ctx.fillStyle = t.color;
	ctx.font = `${t.style} ${t.size}px Arial`;
	ctx.textAlign = 'left';
	ctx.textBaseline = 'top';
	ctx.fillText(t.text, t.x, t.y);
	ctx.restore();
}

export function roundedImage(p: RoundedPhoto, ctx: CanvasRenderingContext2D) {
	let image = new Image();
	image.src = p.photoUrl;
	image.onload = () => {
		ctx.save();
		roundedPath({ ...p }, ctx);
		ctx.clip();
		ctx.drawImage(image, p.x, p.y, p.width, p.height);
		ctx.restore();
	};
}

export function drawCircle(c: Circle, ctx: CanvasRenderingContext2D) {
	ctx.beginPath();
	ctx.arc(c.x, c.y, c.radius, 0, 2 * Math.PI);
	ctx.fill();
}

export function roundedRectagle(r: RoundedPlane2D, ctx: CanvasRenderingContext2D) {
	ctx.fillStyle = 'white';
	roundedPath(r, ctx);
	ctx.stroke();
	ctx.fill();
}

export function roundedPath(c: RoundedPlane2D, ctx: CanvasRenderingContext2D) {
	ctx.beginPath();
	ctx.moveTo(c.x + c.radius, c.y);
	ctx.lineTo(c.x + c.width - c.radius, c.y);
	ctx.quadraticCurveTo(c.x + c.width, c.y, c.x + c.width, c.y + c.radius);
	ctx.lineTo(c.x + c.width, c.y + c.height - c.radius);
	ctx.quadraticCurveTo(c.x + c.width, c.y + c.height, c.x + c.width - c.radius, c.y + c.height);
	ctx.lineTo(c.x + c.radius, c.y + c.height);
	ctx.quadraticCurveTo(c.x, c.y + c.height, c.x, c.y + c.height - c.radius);
	ctx.lineTo(c.x, c.y + c.radius);
	ctx.quadraticCurveTo(c.x, c.y, c.x + c.radius, c.y);
	ctx.closePath();
}
