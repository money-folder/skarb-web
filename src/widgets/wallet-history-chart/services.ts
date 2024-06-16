interface Point {
  x: number;
  y: number;
}

interface DrawLineParams {
  lineWidth?: number;
}

export const drawLine = (
  context: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  params?: DrawLineParams
) => {
  context.beginPath();

  context.moveTo(x1, y1);
  context.lineTo(x2, y2);

  if (params?.lineWidth) {
    context.lineWidth = params.lineWidth;
  }

  context.stroke();
};

export const drawLinesFromPoints = (
  context: CanvasRenderingContext2D,
  points: Point[]
) => {
  points.forEach((point, index) => {
    // draw a line
    if (index < points.length - 1) {
      drawLine(
        context,
        point.x,
        point.y,
        points[index + 1].x,
        points[index + 1].y
      );
    }
  });
};
