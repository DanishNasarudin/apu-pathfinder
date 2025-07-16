"use client";
import { floorSvg } from "@/lib/floorSvg";
import { createURL, round } from "@/lib/utils";
import { useFloorStore } from "@/lib/zus-store";
import { FloorType, getData, Point } from "@/services/localCrud";
import L, { LeafletMouseEvent } from "leaflet";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";
import "leaflet/dist/leaflet.css";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useMemo, useState, useTransition } from "react";
import {
  MapContainer,
  SVGOverlay,
  useMapEvents,
  ZoomControl,
} from "react-leaflet";
import Control from "react-leaflet-custom-control";
import { useMediaQuery } from "usehooks-ts";
import { useShallow } from "zustand/shallow";
import AnimatedPath from "./animated-path";
import FitBounds from "./fit-bounds";
import PointCircle from "./FloorRendering/PointCircle";
import { Button } from "./ui/button";

export default function TestingMap({
  path = [],
  floor = "Floor 6",
  isEditing = false,
}: {
  path: Point[];
  floor: string;
  isEditing: boolean;
}) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [paths, setPaths] = useState<React.ReactNode[]>([]);
  const [isPending, startTransition] = useTransition();

  const bounds: [[number, number], [number, number]] = [
    [0, 0],
    [1000, 1400],
  ];

  const positions: [number, number][] = useMemo(
    () => path.map((p) => [1000 - p.y, p.x]),
    [path]
  );

  const { id, points, edges, initData } = useFloorStore();

  const floorObject: FloorType = { id, points, edges };

  const edgePaths = useMemo(
    () =>
      edges.map((edge, index) => {
        const fromPoint = points.find((p) => p.name === edge.from)!;
        const toPoint = points.find((p) => p.name === edge.to)!;
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
      }),
    [edges, points]
  );

  const pointCircleEdit = useMemo(
    () =>
      floorObject.points.map((point) => (
        <React.Fragment key={`point-${point.id}`}>
          <PointCircle x={point.x} y={point.y} name={point.name} />
        </React.Fragment>
      )),
    [floorObject]
  );

  const totalPath: React.ReactNode[] = useMemo(
    () =>
      isEditing ? [...paths, ...edgePaths, ...pointCircleEdit] : [...paths],
    [isEditing, edgePaths, pointCircleEdit, paths]
  );

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const setSearchParams = new URLSearchParams(searchParams);

  const [selectFloor, setSelectFloor] = useState("");

  useEffect(() => {
    const src = floorSvg.find((item) => item.id === floor)?.src;
    if (!src) return;

    startTransition(() => {
      fetch(src)
        .then((res) => res.text())
        .then((raw) => {
          const doc = new DOMParser().parseFromString(raw, "image/svg+xml");
          const svg = doc.querySelector("svg");
          if (!svg) return;

          const newShapes: React.ReactNode[] = [];
          svg
            .querySelectorAll<SVGElement>(
              "path, polygon, rect, circle, ellipse, text"
            )
            .forEach((el, i) => {
              const tag =
                el.tagName.toLowerCase() as keyof JSX.IntrinsicElements;
              const id = el.getAttribute("id") ?? `${tag}-${i}`;

              const dynamicProps: Record<string, any> = {};
              Array.from(el.attributes).forEach((attr) => {
                if (attr.name === "style") {
                  const styleObj: Record<string, string> = {};
                  attr.value.split(";").forEach((pair) => {
                    const [k, v] = pair.split(":");
                    if (k && v) {
                      styleObj[
                        k.trim().replace(/-([a-z])/g, (_, l) => l.toUpperCase())
                      ] = v.trim();
                    }
                  });
                  dynamicProps.style = styleObj;
                } else {
                  dynamicProps[attr.name] = attr.value;
                }
              });

              let children: React.ReactNode;
              if (tag === "text") {
                const textEl = el as SVGTextElement;
                const tspans = Array.from(textEl.querySelectorAll("tspan"));
                if (tspans.length) {
                  children = tspans.map((t, idx) => {
                    const tProps: React.SVGProps<SVGTSpanElement> = {
                      key: idx,
                    };

                    Array.from(t.attributes).forEach((attr) => {
                      if (attr.name === "style") {
                        const styleObj: React.CSSProperties = {};
                        attr.value.split(";").forEach((pair) => {
                          const [k, v] = pair.split(":");
                          if (k && v) {
                            const jsKey = k
                              .trim()
                              .replace(/-([a-z])/g, (_, l) => l.toUpperCase());
                            (styleObj as any)[jsKey] = v.trim();
                          }
                        });
                        tProps.style = styleObj;
                      } else {
                        (tProps as any)[attr.name] = attr.value;
                      }
                    });

                    return React.createElement("tspan", tProps, t.textContent);
                  });
                } else if (textEl.textContent?.includes("\n")) {
                  const x = textEl.getAttribute("x") ?? "0";
                  const lines = textEl.textContent.split(/\r?\n/);
                  children = lines.map((line, idx) => {
                    const tProps: React.SVGProps<SVGTSpanElement> = {
                      key: idx,
                      x,
                      dy: idx === 0 ? undefined : "1em",
                    };
                    return React.createElement("tspan", tProps, line);
                  });
                } else {
                  children = textEl.textContent;
                }
              }

              newShapes.push(
                React.createElement(
                  tag,
                  {
                    key: id,
                    ...(dynamicProps as React.SVGProps<SVGElement>),
                    // onClick: (e: React.MouseEvent<SVGElement>) =>
                    //   console.log("Clicked:", id),
                    onMouseEnter: (e: React.MouseEvent<SVGElement>) => {
                      const fill = dynamicProps.style.fill as
                        | string
                        | undefined;
                      // if (fill && fill !== "none" && tag !== "text")
                      //   e.currentTarget.style.fill = "orange";

                      // console.log(fill, tag, "C");
                    },
                    onMouseLeave: (e: React.MouseEvent<SVGElement>) => {
                      if (dynamicProps.style.fill)
                        e.currentTarget.style.fill = dynamicProps.style.fill;
                    },
                  },
                  children
                )
              );
            });

          setPaths(newShapes);
        });
    });
  }, [floor]);

  useEffect(() => {
    const initializeData = async () => {
      if (floor !== "default") {
        const floorData = getData();
        const currentFloor = (await floorData).find(
          (item) => item.id === floor
        );

        if (currentFloor === undefined) throw new Error("Floor ID Not Found.");

        initData(currentFloor);
      }
    };

    initializeData().catch((e) => console.error(e));
  }, [floor, isEditing]);

  useEffect(() => {
    if (selectFloor) {
      setSearchParams.set("floor", selectFloor);
    } else {
      setSearchParams.delete("floor");
    }

    const setURL = createURL(`${pathname}/`, setSearchParams);
    router.push(setURL);
  }, [pathname, searchParams, selectFloor]);

  if (isPending) {
    return (
      <div className="h-[60vh] w-full animate-pulse bg-foreground/10"></div>
    );
  }

  return (
    <MapContainer
      crs={L.CRS.Simple}
      bounds={bounds}
      minZoom={-1}
      style={{ height: "60vh", width: "100%", zIndex: 4 }}
      attributionControl={false}
      zoomControl={false}
      zoomSnap={isMobile ? 0 : 1}
    >
      <ClickHandler />
      <AnimatedPath points={positions} />
      <FitBounds positions={positions} padding={50} />
      <SVGOverlay bounds={bounds} interactive className="!z-[2]">
        <svg viewBox="0 0 1400 1000" xmlns="http://www.w3.org/2000/svg">
          {totalPath}
        </svg>
      </SVGOverlay>
      <ZoomControl position="bottomright" />
      <Control prepend position="bottomright">
        <div className="flex flex-col-reverse gap-2">
          {floorSvg.map((floor, idx) => (
            <Button
              key={idx}
              variant={"outline"}
              size={"icon"}
              className="h-8 w-8"
              onClick={() => setSelectFloor(floor.id)}
            >
              F{floor.id.split(" ")[1]}
            </Button>
          ))}
        </div>
      </Control>
    </MapContainer>
  );
}

const ClickHandler: React.FC = () => {
  const { id, points, pendingAdd, junctionAdd } = useFloorStore();
  const addPoints = useFloorStore(useShallow((state) => state.addPoint));

  const handleClick = async (x: number, y: number) => {
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
          x: round(x, 0),
          y: round(1000 - y, 0),
        });
      } else {
        addPoints({
          id: -1,
          type: "point",
          name: "",
          x: round(x, 0),
          y: round(1000 - y, 0),
        });
      }
  };

  useMapEvents({
    click(e: LeafletMouseEvent) {
      const x = e.latlng.lng;
      const y = e.latlng.lat;
      handleClick(x, y);
      // console.log("Clicked at overlay coords:", { x, y });
    },
  });
  return null;
};
