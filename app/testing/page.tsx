import { findShortestPathDijkstraDynamic } from "@/lib/algorithms";
import { floorsSvg } from "@/lib/floorData";
import { Edge, getData, Point } from "@/services/localCrud";
import dynamic from "next/dynamic";

const TestingMap = dynamic(() => import("@/components/testing-map"), {
  ssr: false,
});

export default async function Page() {
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

  const startId = "B-06-01";
  const endId = "B-06-05";

  const floorId = "Floor 6";

  const width = 1400; // 700
  const height = 1000; // 500

  const isEditing = false;

  const floors = await getData();

  const allPoints = floors.flatMap((floor) => floor.points);
  const allEdges = [
    ...floors.flatMap((floor) => floor.edges),
    ...interFloorEdges,
  ];

  const checkStart = allPoints.find((item) => item.name === startId);
  const checkEnd = allPoints.find((item) => item.name === endId);

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

  return (
    <TestingMap path={renderFullPaths} floor={floorId} isEditing={false} />
  );
}
