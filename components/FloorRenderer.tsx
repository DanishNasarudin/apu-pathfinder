import { FloorType } from "@/lib/floorData";
import React from "react";

type Props = {
  floor: FloorType;
  width?: number;
  height?: number;
};

const FloorRenderer = ({ floor, width = 500, height = 500 }: Props) => {
  // const floor = floors.find((f) => f.id === floorId);
  if (!floor) return null;

  const edgePaths = floor.edges.map((edge, index) => {
    const fromPoint = floor.points.find((p) => p.id === edge.from)!;
    const toPoint = floor.points.find((p) => p.id === edge.to)!;
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
      width={width}
      height={height}
      style={{ position: "absolute", top: 0, left: 0, zIndex: 1 }}
    >
      {floor.svg}
      {edgePaths}
      {floor.points.map((point) => (
        <React.Fragment key={point.id}>
          <circle cx={point.x} cy={point.y} r={1.5} fill="red" />
          {/* <text x={point.x + 5} y={point.y} fontSize="10" fill="white">
            {point.id}
          </text> */}
        </React.Fragment>
      ))}
    </svg>
  );
};

export default FloorRenderer;
