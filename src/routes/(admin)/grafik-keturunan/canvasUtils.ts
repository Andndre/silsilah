import type { Coords } from "$lib/types";

export function drawGrid(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  zoom: number,
  position: Coords,
) {
  // // Calculate the number of grid lines to cover the canvas
  // const gridSize = 10 / zoom;
  // const numLinesX = Math.ceil(width / (gridSize * zoom));
  // const numLinesY = Math.ceil(height / (gridSize * zoom));

  // // Calculate the start and end positions for the grid lines
  // const startX = position.x / gridSize * gridSize - width / 2;
  // const startY = position.y / gridSize * gridSize - height / 2;
  // const endX = startX + numLinesX * gridSize;
  // const endY = startY + numLinesY * gridSize;

  // // Draw grid lines
  // for (let x = startX; x <= endX; x += gridSize) {
  //   const startCoords = calculateOffsetCoords(x, startY, zoom, position, width, height);
  //   const endCoords = calculateOffsetCoords(x, endY, zoom, position, width, height);

  //   context.beginPath();
  //   context.moveTo(startCoords.x, startCoords.y);
  //   context.lineTo(endCoords.x, endCoords.y);
  //   context.strokeStyle = 'gray';
  //   context.lineWidth = 1;
  //   context.stroke();
  // }

  // for (let y = startY; y <= endY; y += gridSize) {
  //   const startCoords = calculateOffsetCoords(startX, y, zoom, position, width, height);
  //   const endCoords = calculateOffsetCoords(endX, y, zoom, position, width, height);

  //   context.beginPath();
  //   context.moveTo(startCoords.x, startCoords.y);
  //   context.lineTo(endCoords.x, endCoords.y);
  //   context.strokeStyle = 'gray';
  //   context.lineWidth = 1;
  //   context.stroke();
  // }


  // Example: Draw a line with reversed panning direction
  const lineStartCoords = calculateOffsetCoords(50, 50, zoom, position, width, height);
  const lineEndCoords = calculateOffsetCoords(200, 200, zoom, position, width, height);

  context.beginPath();
  context.moveTo(lineStartCoords.x, lineStartCoords.y);
  context.lineTo(lineEndCoords.x, lineEndCoords.y);
  context.strokeStyle = 'black';
  context.lineWidth = 2;
  context.stroke();
}

function calculateOffsetCoords(x: number, y: number, zoom: number, position: Coords, width: number, height: number) {
  const offsetX = (x - position.x) * zoom;
  const offsetY = (y - position.y) * zoom;
  return {
    x: offsetX,
    y: offsetY
  };
}
