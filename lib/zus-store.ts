import { Edge, FloorType, Point } from "@/services/localCrud";
import { create } from "zustand";
import { handleError } from "./utils";

type FloorStore = {
  id: string;
  points: Point[];
  edges: Edge[];
  pendingAdd: boolean;
  junctionAdd: boolean;
  reset: () => void;
  initData: (newValue: FloorType) => void;
  triggerAddPoint: () => void;
  triggerAddJunction: () => void;
  addPoint: (newPoint: Point) => void;
  updatePoint: (newPoint: Point) => void;
  deletePoint: (id: number) => void;
  addEdge: (newEdge: Edge) => void;
  updateEdge: (newEdge: Edge) => void;
  deleteEdge: (id: number) => void;
};

export const useFloorStore = create<FloorStore>()((set) => ({
  id: "default",
  points: [],
  edges: [],
  pendingAdd: false,
  junctionAdd: false,
  reset: () =>
    set(() => ({ id: "default", points: [], edges: [], pendingAdd: false })),
  initData: (newValue) =>
    set({ id: newValue.id, points: newValue.points, edges: newValue.edges }),
  triggerAddPoint: () => set(() => ({ pendingAdd: true })),
  triggerAddJunction: () =>
    set((state) => ({ junctionAdd: !state.junctionAdd })),
  addPoint: (newPoint) =>
    set((state) => {
      const lastId = state.points.findLast((item) => item.id);

      if (lastId === undefined)
        handleError("Adding Point failed. Last id not found.");

      const newId = lastId !== undefined ? lastId?.id + 1 : -1;

      const toAddPoint = {
        ...newPoint,
        id: newId,
        name: newPoint.name === "" ? "enter a name" : newPoint.name,
      };

      if (toAddPoint.id === -1) handleError("Adding Point failed. Id invalid");

      return { points: [...state.points, toAddPoint], pendingAdd: false };
    }),
  updatePoint: (newPoint) =>
    set((state) => {
      const updatedPoint = state.points.map((item) =>
        item.id === newPoint.id ? newPoint : item
      );

      return { points: [...updatedPoint] };
    }),
  deletePoint: (id) =>
    set((state) => {
      const filteredPoints = state.points.filter((item) => item.id !== id);
      const filteredEdges = state.edges.filter(
        (item) => !(item.fromId === id || item.toId === id)
      );

      return { points: [...filteredPoints], edges: [...filteredEdges] };
    }),
  addEdge: (newEdge) =>
    set((state) => {
      const lastId = state.edges.findLast((item) => item.id);

      if (lastId === undefined)
        handleError("Adding Edge failed. Last id not found.");

      const newId = lastId !== undefined ? lastId?.id + 1 : -1;

      const toAddEdge = { ...newEdge, id: newId };

      if (toAddEdge.id === -1) handleError("Adding Edge failed. Id invalid");

      return { edges: [...state.edges, toAddEdge] };
    }),
  updateEdge: (newEdge) =>
    set((state) => {
      const updatedEdge = state.edges.map((item) =>
        item.id === newEdge.id ? newEdge : item
      );

      return { edges: [...updatedEdge] };
    }),
  deleteEdge: (id) =>
    set((state) => {
      const filteredEdges = state.edges.filter((item) => item.id !== id);

      return { edges: [...filteredEdges] };
    }),
}));
