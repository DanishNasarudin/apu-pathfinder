"use client";
import React, { useState } from "react";

type Props = {
  svg: JSX.Element;
  width?: number;
  height?: number;
};

const FloorCoordinates = ({ svg, width = 500, height = 500 }: Props) => {
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
    setCoordinates({ x: svgCoords.x, y: svgCoords.y });

    console.log(
      `Coordinates: (x: ${Math.floor(svgCoords.x)}, y: ${Math.floor(
        svgCoords.y
      )})`
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
