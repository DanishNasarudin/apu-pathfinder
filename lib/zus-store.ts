import { Edge, FloorType, Point } from "@/services/localCrud";
import { create } from "zustand";

type FloorStore = {
  id: string;
  points: Point[];
  edges: Edge[];
  initData: (newValue: FloorType) => void;
  addPoint: (newPoint: Point) => void;
  updatePoint: (newPoint: Point) => void;
  deletePoint: (id: number) => void;
  addEdge: (newEdge: Edge) => void;
  deleteEdge: (delEdge: Edge) => void;
};

export const useFloorStore = create<FloorStore>()((set) => ({
  id: "default",
  points: [],
  edges: [],
  initData: (newValue) =>
    set({ id: newValue.id, points: newValue.points, edges: newValue.edges }),
  addPoint: (newPoint) =>
    set((state) => {
      const currentPoints = state.points;
      currentPoints.push(newPoint);

      return { points: currentPoints };
    }),
  updatePoint: (newPoint) =>
    set((state) => {
      const updatedPoint = state.points.map((item) => {
        if (item.id === newPoint.id) {
          return newPoint;
        } else {
          return item;
        }
      });

      return { points: updatedPoint };
    }),
  deletePoint: (id) =>
    set((state) => {
      const filteredPoints = state.points.filter((item) => item.id !== id);

      return { points: filteredPoints };
    }),
  addEdge: (newEdge) =>
    set((state) => {
      const currentEdges = state.edges;
      currentEdges.push(newEdge);

      return { edges: currentEdges };
    }),
  deleteEdge: (delEdge) =>
    set((state) => {
      const filteredEdges = state.edges.filter(
        (item) => !(item.from === delEdge.from && item.to === delEdge.to)
      );

      return { edges: filteredEdges };
    }),
}));
