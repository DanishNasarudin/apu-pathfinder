import { Edge, Point } from "@/services/localCrud";
import { handleError } from "./utils";

// Depth-First Search (DFS)
// const findPredefinedPath = (
//     startId: string,
//     endId: string
//   ): Point[] | null => {
//     const visited: Set<string> = new Set();
//     const stack: { current: string; route: string[] }[] = [
//       { current: startId, route: [startId] },
//     ];

//     while (stack.length > 0) {
//       const { current, route } = stack.pop()!;
//       if (current === endId) {
//         return route.map((id) => allPoints.find((point) => point.name === id)!);
//       }

//       visited.add(current);

//       paths
//         .filter((edge) => edge.from === current && !visited.has(edge.to))
//         .forEach((edge) =>
//           stack.push({ current: edge.to, route: [...route, edge.to] })
//         );
//     }

//     return null;
//   };

// Breadth-First Search (BFS)
//   const findShortestPath = (startId: string, endId: string): Point[] | null => {
//     const queue: { current: string; route: string[] }[] = [
//       { current: startId, route: [startId] },
//     ];
//     const visited: Set<string> = new Set();

//     while (queue.length > 0) {
//       const { current, route } = queue.shift()!;
//       if (current === endId) {
//         return route.map((id) => allPoints.find((point) => point.name === id)!);
//       }

//       visited.add(current);

//       paths
//         .filter((edge) => edge.from === current && !visited.has(edge.to))
//         .forEach((edge) => {
//           queue.push({ current: edge.to, route: [...route, edge.to] });
//         });
//     }

//     return null;
//   };

// Dijkstra's
const calculateDistance = (point1: Point, point2: Point): number => {
  return Math.sqrt(
    Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2)
  );
};

export const findShortestPathDijkstraDynamic = (
  startId: string,
  endId: string,
  edges: Edge[],
  points: Point[]
): Point[] | null => {
  const distances: Record<string, number> = {};
  const previous: Record<string, string | null> = {};
  const unvisited = new Set<string>();

  if (!points || points.length === 0) {
    handleError("Points array is undefined or empty");
    return null;
  }

  // console.log(points, "CHECK");

  // Initialize distances and unvisited set
  points.forEach((point) => {
    distances[point.name] = point.name === startId ? 0 : Infinity;
    previous[point.name] = null;
    unvisited.add(point.name);
  });

  while (unvisited.size > 0) {
    // Find the unvisited node with the smallest distance
    const current = Array.from(unvisited).reduce((closest, node) =>
      distances[node] < distances[closest] ? node : closest
    );

    // console.log(current, distances[current], "CH");

    if (distances[current] === Infinity) {
      // No remaining reachable nodes
      break;
    }

    if (current === endId) {
      // Build the shortest path
      const path: Point[] = [];
      let step: string | null = endId;
      while (step) {
        const point = points.find((p) => p.name === step);
        if (point) path.unshift(point);
        step = previous[step];
      }
      return path;
    }

    // Remove current node from unvisited
    unvisited.delete(current);

    // Update distances to neighbors
    edges
      .filter((edge) => edge.from === current)
      .forEach((edge) => {
        const fromPoint = points.find((p) => p.name === edge.from);
        const toPoint = points.find((p) => p.name === edge.to);

        if (fromPoint && toPoint) {
          const weight = calculateDistance(fromPoint, toPoint);
          const newDistance = distances[current] + weight;

          // console.log(
          //   `Checking Edge: ${edge.from} -> ${edge.to}, Current Distance: ${distances[current]}, Weight: ${weight}, New Distance: ${newDistance}`
          // );

          if (newDistance < distances[edge.to]) {
            // console.log(`Updating distance for ${edge.to}: ${newDistance}`);
            distances[edge.to] = newDistance;
            previous[edge.to] = current;
          }
        } else {
          console.error(`Invalid edge: ${edge.from} -> ${edge.to}`);
        }
      });
  }

  // console.error("Path not found.");
  return null; // No path found
};
