"use client";
import { round } from "@/lib/utils";
import { useFloorStore } from "@/lib/zus-store";
import { getData } from "@/services/localCrud";
import React, { useEffect } from "react";
import { useTransformContext } from "react-zoom-pan-pinch";
import { useShallow } from "zustand/shallow";

type Props = {
  width?: number;
  height?: number;
  floorId?: string;
};

const FloorCoordinates = ({
  width = 500,
  height = 500,
  floorId = "default",
}: Props) => {
  const transformState = useTransformContext();

  const { initData, id, points, pendingAdd, junctionAdd } = useFloorStore();

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

    const floorNum = id.split(" ")[1];

    if (pendingAdd)
      if (junctionAdd) {
        const juncNum = points
          .filter((item) => item.type === "junction")
          .at(-1)
          ?.name.match(/J(\d+)/);

        const numberAfterJ = juncNum ? parseInt(juncNum[1], 10) + 1 : 1;

        addPoints({
          id: -1,
          type: "junction",
          name: `0${floorNum}-J${numberAfterJ}`,
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
    ></svg>
  );
};

export default FloorCoordinates;
