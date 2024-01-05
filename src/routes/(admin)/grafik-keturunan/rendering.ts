import type { Circle, ChildNode, Plane2D, RoundedPhoto, RoundedPlane2D, Size2D, Text, ParentNode } from '$lib/types';

const cardWidth = 300;
const cardHeight = 80;

export function drawChildNode(node: ChildNode, ctx: CanvasRenderingContext2D, drawImage: boolean) {

	// Draw rounded card
	drawRoundedRectagle(
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
		drawRoundedImage(
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
		y: node.y + padding * 5
	}, ctx);

	// Draw birth date
	text({
		text: node.birthDate,
		color: 'rgba(0, 0, 0, 0.5)',
		size: 10,
		style: 'italic',
		x: node.x + spaceTakenOnLeft + padding,
		y: node.y + padding * 6 + titleSize
	}, ctx);

	// Returning the card plane2d
	return {
		width: cardWidth,
		height: cardHeight,
		x: node.x,
		y: node.y
	} as Plane2D;
}

export function drawParentNode(node: ParentNode, ctx: CanvasRenderingContext2D, drawImage: boolean) {
	const padding = 5;
	drawRoundedRectagle({
		x: node.x,
		y: node.y,
		width: padding * 2 + cardWidth,
		height: padding * 3 + cardHeight * 2,
		radius: 14
	}, ctx, true, 'rgb(200, 200, 200)');

	const ayah = drawChildNode({
		name: node.namaAyah,
		birthDate: node.birthDateAyah,
		photoUrl: node.photoAyah,
		x: node.x + padding,
		y: node.y + padding
	}, ctx, drawImage);

	drawChildNode({
		name: node.namaIbu,
		birthDate: node.birthDateIbu,
		photoUrl: node.photoIbu,
		x: node.x + padding,
		y: node.y + ayah.height + padding * 2
	}, ctx, drawImage);
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
	ctx.fillText(t.text, Math.round(t.x), Math.round(t.y));
	ctx.restore();
}

export function drawRoundedImage(p: RoundedPhoto, ctx: CanvasRenderingContext2D) {
	let image = new Image();
	image.src = p.photoUrl;
	image.onload = () => {
		ctx.save();
		roundedPath({ ...p }, ctx);
		ctx.clip();
		ctx.drawImage(image, Math.round(p.x), Math.round(p.y), Math.ceil(p.width), Math.ceil(p.height));
		ctx.restore();
	};
}

export function drawCircle(c: Circle, ctx: CanvasRenderingContext2D) {
	ctx.beginPath();
	ctx.arc(c.x, c.y, c.radius, 0, 2 * Math.PI);
	ctx.fill();
}

export function drawRoundedRectagle(r: RoundedPlane2D, ctx: CanvasRenderingContext2D, fill = true, color = 'white') {
	ctx.fillStyle = color;
	roundedPath(r, ctx);
	ctx.stroke();
	if (fill) ctx.fill();
}

export function roundedPath(c: RoundedPlane2D, ctx: CanvasRenderingContext2D) {
	ctx.beginPath();
	ctx.moveTo(Math.round(c.x + c.radius), Math.round(c.y));
	ctx.lineTo(Math.round(c.x + c.width - c.radius), Math.round(c.y));
	ctx.quadraticCurveTo(Math.round(c.x + c.width), Math.round(c.y), Math.round(c.x + c.width), Math.round(c.y + c.radius));
	ctx.lineTo(Math.round(c.x + c.width), Math.round(c.y + c.height - c.radius));
	ctx.quadraticCurveTo(Math.round(c.x + c.width), Math.round(c.y + c.height), Math.round(c.x + c.width - c.radius), Math.round(c.y + c.height));
	ctx.lineTo(Math.round(c.x + c.radius), Math.round(c.y + c.height));
	ctx.quadraticCurveTo(Math.round(c.x), Math.round(c.y + c.height), Math.round(c.x), Math.round(c.y + c.height - c.radius));
	ctx.lineTo(Math.round(c.x), Math.round(c.y + c.radius));
	ctx.quadraticCurveTo(Math.round(c.x), Math.round(c.y), Math.round(c.x + c.radius), Math.round(c.y));
	ctx.closePath();
}
