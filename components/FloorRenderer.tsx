import { floors } from "@/lib/floorData";
import React from "react";

type Props = {
  floorId: string;
};

const FloorRenderer = ({ floorId }: Props) => {
  const floor = floors.find((f) => f.id === floorId);
  if (!floor) return null;

  const edgePaths = floor.edges.map((edge, index) => {
    const fromPoint = floor.points.find((p) => p.id === edge.from)!;
    const toPoint = floor.points.find((p) => p.id === edge.to)!;
    return (
      <line
        key={index}
        x1={fromPoint.x + 250}
        y1={250 - fromPoint.y}
        x2={toPoint.x + 250}
        y2={250 - toPoint.y}
        stroke="gray"
        strokeWidth={1}
      />
    );
  });

  return (
    <svg
      width="500"
      height="500"
      style={{ position: "absolute", top: 0, left: 0, zIndex: 1 }}
    >
      {floor.svg}
      {edgePaths}
      {floor.points.map((point) => (
        <React.Fragment key={point.id}>
          <circle cx={point.x + 250} cy={250 - point.y} r={3} fill="red" />
          <text x={point.x + 255} y={250 - point.y} fontSize="10" fill="white">
            {point.id}
          </text>
        </React.Fragment>
      ))}
    </svg>
  );
};

export default FloorRenderer;
