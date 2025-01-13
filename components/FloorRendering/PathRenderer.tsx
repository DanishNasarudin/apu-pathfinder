import { Point } from "@/services/localCrud";

type PathProps = {
  path: Point[];
  width?: number;
  height?: number;
};

const PathRenderer = ({ path, width = 500, height = 500 }: PathProps) => {
  // Convert path to SVG path
  const pathD = path
    .map((point, index) =>
      index === 0 ? `M ${point.x} ${point.y}` : `L ${point.x} ${point.y}`
    )
    .join(" ");

  let triangle: { x: number; y: number }[] = [];

  if (path.length > 1) {
    const start = path[0];
    const next = path[1];
    const vector = { x: next.x - start.x, y: next.y - start.y };

    // Normalize the vector to determine direction
    const length = Math.sqrt(vector.x ** 2 + vector.y ** 2);
    const unitVector = { x: vector.x / length, y: vector.y / length };

    const triangleSize = 5;
    const perpendicular = {
      x: -unitVector.y,
      y: unitVector.x,
    };

    triangle = [
      {
        x: start.x + unitVector.x * triangleSize,
        y: start.y + unitVector.y * triangleSize,
      }, // Tip
      {
        x: start.x + perpendicular.x * triangleSize,
        y: start.y + perpendicular.y * triangleSize,
      }, // Bottom-left
      {
        x: start.x - perpendicular.x * triangleSize,
        y: start.y - perpendicular.y * triangleSize,
      }, // Bottom-right
    ];
  }

  return (
    <svg
      width={"100%"}
      viewBox={`0 0 ${width} ${height}`}
      style={{ position: "absolute", top: 0, left: 0, zIndex: 99 }}
    >
      <path d={pathD} stroke="red" fill="none" strokeWidth={1} />
      {triangle.length > 0 && (
        <polygon
          points={triangle.map((point) => `${point.x},${point.y}`).join(" ")}
          fill="red"
        />
      )}
    </svg>
  );
};

export default PathRenderer;
