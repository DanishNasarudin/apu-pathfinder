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

  console.log(pathD, "check");

  return (
    <svg
      width={width}
      height={height}
      style={{ position: "absolute", top: 0, left: 0, zIndex: 99 }}
    >
      <path d={pathD} stroke="blue" fill="none" strokeWidth={1} />
    </svg>
  );
};

export default PathRenderer;
