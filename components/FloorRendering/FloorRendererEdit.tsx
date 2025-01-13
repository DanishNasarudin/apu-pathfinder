"use client";
import { useFloorStore } from "@/lib/zus-store";
import { FloorType } from "@/services/localCrud";
import React from "react";
import PointCircle from "./PointCircle";

type Props = {
  width?: number;
  height?: number;
  svg: JSX.Element;
};

const FloorRendererEdit = ({ width = 500, height = 500, svg }: Props) => {
  const { id, points, edges } = useFloorStore();

  const floor: FloorType = { id, points, edges };

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
      {edgePaths}
      {floor.points.map((point) => (
        <React.Fragment key={point.id}>
          <PointCircle x={point.x} y={point.y} name={point.name} />
        </React.Fragment>
      ))}
    </svg>
  );
};

export default FloorRendererEdit;
