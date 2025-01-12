"use client";
import { round } from "@/lib/utils";
import { useFloorStore } from "@/lib/zus-store";
import { getData } from "@/services/localCrud";
import React, { useEffect, useState } from "react";
import { useTransformContext } from "react-zoom-pan-pinch";
import { useShallow } from "zustand/shallow";

type Props = {
  // svg: JSX.Element;
  width?: number;
  height?: number;
  floorId?: string;
};

const FloorCoordinates = ({
  // svg,
  width = 500,
  height = 500,
  floorId = "default",
}: Props) => {
  const transformState = useTransformContext();

  const [coordinates, setCoordinates] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const { initData, points, pendingAdd, junctionAdd } = useFloorStore();

  const addPoints = useFloorStore(useShallow((state) => state.addPoint));

  useEffect(() => {
    const initializeData = async () => {
      if (floorId !== "default") {
        const floorData = getData();
        const currentFloor = (await floorData).find(
          (item) => item.id === floorId
        );

        if (currentFloor === undefined) throw new Error("Floor ID Not Found.");

        initData(currentFloor);
      }
    };

    initializeData().catch((e) => console.error(e));
  }, [floorId]);

  const handleClick = async (
    event: React.MouseEvent<SVGSVGElement, MouseEvent>
  ) => {
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

    const unscaledSvgX = round(svgCoords.x / scale, 0);
    const unscaledSvgY = round(svgCoords.y / scale, 0);

    setCoordinates({ x: unscaledSvgX, y: unscaledSvgY });

    // console.log(
    //   `Unscaled SVG Coordinates: x - ${unscaledSvgX}, y - ${unscaledSvgY}`
    // );

    // console.log(points);

    if (pendingAdd)
      if (junctionAdd) {
        addPoints({
          id: -1,
          type: "junction",
          name: "0-J",
          x: unscaledSvgX,
          y: unscaledSvgY,
        });
      } else {
        addPoints({
          id: -1,
          type: "point",
          name: "",
          x: unscaledSvgX,
          y: unscaledSvgY,
        });
      }
  };

  return (
    <svg
      width={"100%"}
      viewBox={`0 0 ${width} ${height}`}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: pendingAdd ? 5 : 1,
      }}
      onClick={handleClick}
    >
      {/* {svg} */}
    </svg>
  );
};

export default FloorCoordinates;
