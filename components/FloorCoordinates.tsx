"use client";
import { round } from "@/lib/utils";
import React, { useState } from "react";
import { useTransformContext } from "react-zoom-pan-pinch";

type Props = {
  svg: JSX.Element;
  width?: number;
  height?: number;
};

const FloorCoordinates = ({ svg, width = 500, height = 500 }: Props) => {
  const transformState = useTransformContext();

  const [coordinates, setCoordinates] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const handleClick = (event: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    const svgElement = event.currentTarget;
    const point = svgElement.createSVGPoint();
    // console.log(point);
    point.x = event.clientX;
    point.y = event.clientY;

    // Convert the mouse point to SVG coordinates
    const svgCoords = point.matrixTransform(
      svgElement.getScreenCTM()?.inverse()
    );

    const { scale } = transformState.getContext().state;

    const unscaledSvgX = round(svgCoords.x / scale, 1);
    const unscaledSvgY = round(svgCoords.y / scale, 1);

    setCoordinates({ x: unscaledSvgX, y: unscaledSvgY });

    console.log(
      `Unscaled SVG Coordinates: x - ${unscaledSvgX}, y - ${unscaledSvgY}`
    );
  };

  return (
    <svg
      width={width}
      height={height}
      style={{ position: "absolute", top: 0, left: 0, zIndex: 5 }}
      onClick={handleClick}
    >
      {/* {svg} */}
    </svg>
  );
};

export default FloorCoordinates;
