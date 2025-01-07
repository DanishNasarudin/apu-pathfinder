import FloorCoordinates from "@/components/FloorCoordinates";
import FloorRenderer from "@/components/FloorRenderer";
import PathRenderer from "@/components/PathRenderer";
import TransformWrapper from "@/components/TransformWrapper";
import UserActions from "@/components/UserActions";
import { Edge, floors, Point } from "@/lib/floorData";
import React from "react";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function Home({ searchParams }: Props) {
  const interFloorEdges: Edge[] = [{ from: "Lift5", to: "Lift6" }];

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

  const startId = searchStart || "B-05-01";
  const endId = searchEnd || "B-05-01";

  const floorId = searchFloor || "Floor 1";

  const width = 700;
  const height = 500;

  const isEditing = Boolean(searchEdit) || false;

  const allPoints = floors.flatMap((floor) => floor.points);
  const allEdges = floors
    .flatMap((floor) => floor.edges)
    .concat(interFloorEdges);

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
        bidirectionalEdges.push({ from: edge.to, to: edge.from });
      }
    });

    return bidirectionalEdges;
  };

  const paths: Edge[] = makeBidirectional(allEdges);

  const findPredefinedPath = (
    startId: string,
    endId: string
  ): Point[] | null => {
    const visited: Set<string> = new Set();
    const stack: { current: string; route: string[] }[] = [
      { current: startId, route: [startId] },
    ];

    while (stack.length > 0) {
      const { current, route } = stack.pop()!;
      if (current === endId) {
        return route.map((id) => allPoints.find((point) => point.id === id)!);
      }

      visited.add(current);

      paths
        .filter((edge) => edge.from === current && !visited.has(edge.to))
        .forEach((edge) =>
          stack.push({ current: edge.to, route: [...route, edge.to] })
        );
    }

    return null;
  };

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
        type: start.type,
        id: start.id,
        x,
        y,
      });
    }

    return path;
  };

  const renderPoints = floors.find((item) => item.id === floorId)?.points || [];

  const pointPath = findPredefinedPath(startId, endId);
  const fullPath = pointPath ? generateFullPath(pointPath) : [];

  const renderFullPaths = fullPath.filter((point) =>
    renderPoints.some((p) => p.id === point.id)
  );

  // createData(floors[1]);

  // console.log(renderFullPaths);

  const FloorComponent = () => {
    return (
      <div style={{ position: "relative", width, height }}>
        {floors.map(
          (floor) =>
            floor.id === floorId && (
              <React.Fragment key={floor.id}>
                <FloorRenderer floor={floor} width={width} height={height} />
                {/* {isEditing && (
                  <FloorCoordinates
                    svg={floor.svg}
                    width={width}
                    height={height}
                  />
                )} */}
                <FloorCoordinates
                  svg={floor.svg}
                  width={width}
                  height={height}
                />
              </React.Fragment>
            )
        )}
        <PathRenderer path={renderFullPaths} width={width} height={height} />
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-2 w-full items-center">
      {/* {!isEditing ? (
        <TransformWrapper>
          <FloorComponent />
        </TransformWrapper>
      ) : (
        <FloorComponent />
      )} */}
      <TransformWrapper>
        <FloorComponent />
      </TransformWrapper>

      <UserActions
        allPoints={allPoints
          .filter((item) => item.type === "point")
          .map((item) => item.id)}
        floors={floors.map((item) => item.id)}
      />
      <section className="h-[200px]" />
    </div>
  );
}
