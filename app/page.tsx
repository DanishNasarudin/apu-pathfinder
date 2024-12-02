import FloorRenderer from "@/components/FloorRenderer";
import UserActions from "@/components/UserActions";
import { Edge, floors, Point } from "@/lib/floorData";

type PathProps = {
  path: Point[];
};

const PathRenderer = ({ path }: PathProps) => {
  // Convert path to SVG path
  const pathD = path
    .map((point, index) =>
      index === 0
        ? `M ${point.x + 250} ${250 - point.y}`
        : `L ${point.x + 250} ${250 - point.y}`
    )
    .join(" ");

  return (
    <svg
      width="500"
      height="500"
      style={{ position: "absolute", top: 0, left: 0, zIndex: 2 }}
    >
      <path d={pathD} stroke="blue" fill="none" strokeWidth={2} />
    </svg>
  );
};

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function Home({ searchParams }: Props) {
  const interFloorEdges: Edge[] = [{ from: "Lift1", to: "Lift2" }];

  const allPoints = floors.flatMap((floor) => floor.points);
  const allEdges = floors
    .flatMap((floor) => floor.edges)
    .concat(interFloorEdges);

  const makeBidirectional = (edges: Edge[]): Edge[] => {
    const uniqueEdges = new Set<string>();
    const bidirectionalEdges: Edge[] = [];

    edges.forEach((edge) => {
      const forwardKey = `${edge.from}->${edge.to}`;
      const reverseKey = `${edge.to}->${edge.from}`;

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

      // Add connected paths to the stack
      paths
        .filter((edge) => edge.from === current && !visited.has(edge.to))
        .forEach((edge) =>
          stack.push({ current: edge.to, route: [...route, edge.to] })
        );
    }

    return null; // No path found
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
    const steps = Math.abs(end.x - start.x) + Math.abs(end.y - start.y);

    for (let i = 0; i <= steps; i++) {
      const x =
        i <= Math.abs(end.x - start.x)
          ? start.x + Math.sign(end.x - start.x) * i
          : end.x;
      const y =
        i > Math.abs(end.x - start.x)
          ? start.y +
            Math.sign(end.y - start.y) * (i - Math.abs(end.x - start.x))
          : start.y;
      path.push({ type: start.type, id: start.id, x, y });
    }

    return path;
  };

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

  const startId = searchStart || "A1";
  const endId = searchEnd || "A1";

  const floorId = searchFloor || "Floor 1";

  const renderPoints = floors.find((item) => item.id === floorId)?.points || [];

  const pointPath = findPredefinedPath(startId, endId);
  const fullPath = pointPath ? generateFullPath(pointPath) : [];

  const renderFullPaths = fullPath.filter((point) =>
    renderPoints.some((p) => p.id === point.id)
  );

  // console.log(renderPoints);

  return (
    <div className="flex flex-col gap-2 w-full items-center">
      <div style={{ position: "relative", width: "500px", height: "500px" }}>
        {floors.map(
          (floor) =>
            floor.id === floorId && (
              <FloorRenderer key={floor.id} floorId={floor.id} />
            )
        )}
        <PathRenderer path={renderFullPaths} />
      </div>
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
