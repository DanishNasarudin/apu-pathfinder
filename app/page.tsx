import EditPanel from "@/components/EditPanel/EditPanel";
import FloorCoordinates from "@/components/FloorRendering/FloorCoordinates";
import FloorRenderer from "@/components/FloorRendering/FloorRenderer";
import FloorRendererEdit from "@/components/FloorRendering/FloorRendererEdit";
import PathRenderer from "@/components/FloorRendering/PathRenderer";
import TransformWrapper from "@/components/FloorRendering/TransformWrapper";
import UserActions from "@/components/UserActions";
import VersionActions from "@/components/VersionActions";
import { findShortestPathDijkstraDynamic } from "@/lib/algorithms";
import { floorsSvg } from "@/lib/floorData";
import { Edge, getData, Point } from "@/services/localCrud";
import React from "react";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function Home({ searchParams }: Props) {
  const interFloorEdges: Edge[] = [
    { id: 99, from: "E-06-Lift", to: "E-07-Lift", fromId: 66, toId: 66 },
    { id: 99, from: "B-06-Lift", to: "B-07-Lift", fromId: 11, toId: 11 },
    { id: 99, from: "A-06-Lift", to: "A-07-Lift", fromId: 70, toId: 70 },
    { id: 99, from: "A-06-Stairs", to: "A-07-Stairs", fromId: 71, toId: 71 },
    { id: 99, from: "B-06-Stairs", to: "B-07-Stairs", fromId: 64, toId: 64 },
    { id: 99, from: "D-06-Stairs", to: "D-07-Stairs", fromId: 65, toId: 65 },
    { id: 99, from: "E-06-Stairs", to: "E-07-Stairs", fromId: 67, toId: 67 },
    {
      id: 99,
      from: "S-06-Stairs-01",
      to: "S-07-Stairs-01",
      fromId: 68,
      toId: 68,
    },
    {
      id: 99,
      from: "S-06-Stairs-02",
      to: "S-07-Stairs-02",
      fromId: 69,
      toId: 69,
    },
    { id: 99, from: "E-07-Stairs", to: "E-08-Stairs", fromId: 67, toId: 34 },
    { id: 99, from: "D-07-Stairs", to: "D-08-Stairs", fromId: 67, toId: 33 },
    {
      id: 99,
      from: "S-07-Stairs-01",
      to: "S-08-Stairs-01",
      fromId: 68,
      toId: 36,
    },
    {
      id: 99,
      from: "S-07-Stairs-02",
      to: "S-08-Stairs-02",
      fromId: 69,
      toId: 37,
    },
  ];

  const resultParams = await searchParams;

  const searchStart = Array.isArray(resultParams.start)
    ? resultParams.start[0]
    : resultParams.start;
  const searchEnd = Array.isArray(resultParams.end)
    ? resultParams.end[0]
    : resultParams.end;
  const searchFloor = Array.isArray(resultParams.floor)
    ? resultParams.floor[0]
    : resultParams.floor;
  const searchEdit = Array.isArray(resultParams.edit)
    ? resultParams.edit[0]
    : resultParams.edit;

  const startId = searchStart || "B-06-01";
  const endId = searchEnd || "B-06-01";

  const floorId = searchFloor || "Floor 1";

  const width = 1400; // 700
  const height = 1000; // 500

  const isEditing = Boolean(searchEdit) || false;

  const floors = await getData();

  const allPoints = floors.flatMap((floor) => floor.points);
  const allEdges = [
    ...floors.flatMap((floor) => floor.edges),
    ...interFloorEdges,
  ];

  // console.log(allEdges, "te");

  const svg = floorsSvg.find((item) => item.id === floorId)?.svg || <></>;

  const makeBidirectional = (edges: Edge[]): Edge[] => {
    const uniqueEdges = new Set<string>();
    const bidirectionalEdges: Edge[] = [];

    edges.forEach((edge) => {
      const forwardKey = `${edge.from}>${edge.to}`;
      const reverseKey = `${edge.to}>${edge.from}`;

      if (!uniqueEdges.has(forwardKey)) {
        uniqueEdges.add(forwardKey);
        bidirectionalEdges.push(edge);
      }

      if (!uniqueEdges.has(reverseKey)) {
        uniqueEdges.add(reverseKey);
        bidirectionalEdges.push({
          id: edge.id + 1000,
          from: edge.to,
          to: edge.from,
          fromId: edge.toId,
          toId: edge.fromId,
        });
      }
    });

    return bidirectionalEdges;
  };

  const paths: Edge[] = makeBidirectional(allEdges);

  const generateFullPath = (pointPath: Point[]): Point[] => {
    const fullPath: Point[] = [];

    for (let i = 0; i < pointPath.length - 1; i++) {
      const segment = calculateSegment(pointPath[i], pointPath[i + 1]);
      fullPath.push(...segment);
    }

    return fullPath;
  };

  const calculateSegment = (start: Point, end: Point): Point[] => {
    const path: Point[] = [];
    const deltaX = end.x - start.x;
    const deltaY = end.y - start.y;

    const steps = Math.max(Math.abs(deltaX), Math.abs(deltaY));

    const stepX = deltaX / steps;
    const stepY = deltaY / steps;

    for (let i = 0; i <= steps; i++) {
      const x = start.x + stepX * i;
      const y = start.y + stepY * i;

      if (isNaN(x) || isNaN(y)) break;

      path.push({
        id: -1,
        type: start.type,
        name: start.name,
        x,
        y,
      });
    }

    return path;
  };

  const renderPoints = floors.find((item) => item.id === floorId)?.points || [];

  const pointPath = findShortestPathDijkstraDynamic(
    startId,
    endId,
    paths,
    allPoints
  );
  const fullPath = pointPath ? generateFullPath(pointPath) : [];

  const renderFullPaths = fullPath.filter((point) =>
    renderPoints.some((p) => p.name === point.name)
  );

  // createData(floors[1]);

  // console.log(pointPath, "tes");

  const FloorComponent = () => {
    return (
      <div
        style={{ position: "relative", width: "100%" }}
        className="aspect-square md:aspect-[1400/1000]"
      >
        {floors.map(
          (floor) =>
            floor.id === floorId && (
              <React.Fragment key={floor.id}>
                {isEditing ? (
                  <>
                    <FloorRendererEdit
                      width={width}
                      height={height}
                      svg={svg}
                    />
                    <FloorCoordinates
                      width={width}
                      height={height}
                      floorId={floor.id}
                    />
                  </>
                ) : (
                  <FloorRenderer
                    floor={floor}
                    width={width}
                    height={height}
                    svg={svg}
                  />
                )}
              </React.Fragment>
            )
        )}
        {renderFullPaths.length > 0 && (
          <PathRenderer path={renderFullPaths} width={width} height={height} />
        )}
      </div>
    );
  };

  return (
    <div className="relative flex flex-col gap-2 w-full items-center">
      {isEditing && <EditPanel />}
      <div className="relative w-full flex justify-center">
        <TransformWrapper>
          <FloorComponent />
        </TransformWrapper>
      </div>
      <UserActions
        allPoints={allPoints
          .filter(
            (item) =>
              item.type === "point" &&
              !(item.name.includes("Stairs") || item.name.includes("Lift"))
          )
          .map((item) => item.name)}
        floors={floors.map((item) => item.id)}
      />
      <VersionActions />
      <section className="h-[200px]" />
    </div>
  );
}
