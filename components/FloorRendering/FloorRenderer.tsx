import { FloorType } from "@/services/localCrud";

type Props = {
  floor: FloorType;
  width?: number;
  height?: number;
  svg: JSX.Element;
};

const FloorRenderer = ({ floor, width = 500, height = 500, svg }: Props) => {
  // const floor = floors.find((f) => f.id === floorId);
  if (!floor) return null;

  const edgePaths = floor.edges.map((edge, index) => {
    const fromPoint = floor.points.find((p) => p.name === edge.from)!;
    const toPoint = floor.points.find((p) => p.name === edge.to)!;
    return (
      <line
        key={index}
        x1={fromPoint.x}
        y1={fromPoint.y}
        x2={toPoint.x}
        y2={toPoint.y}
        stroke="gray"
        strokeWidth={1}
      />
    );
  });

  return (
    <svg
      width={"100%"}
      viewBox={`0 0 ${width} ${height}`}
      style={{ position: "absolute", top: 0, left: 0, zIndex: 2 }}
      className=" [&>path]:dark:stroke-white [&>g]:dark:stroke-white [&>text]:dark:fill-white"
    >
      {svg}
      {/* {edgePaths} */}
      {/* {floor.points.map((point) => (
        <React.Fragment key={point.id}>
          <circle cx={point.x} cy={point.y} r={1.5} fill="red" />
          <text x={point.x - 3} y={point.y - 3} fontSize="3" fill="white">
            {point.name}
          </text>
        </React.Fragment>
      ))} */}
    </svg>
  );
};

export default FloorRenderer;
