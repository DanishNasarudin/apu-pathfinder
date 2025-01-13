"use client";

import { useFloorStore } from "@/lib/zus-store";
import { useState } from "react";
import { useShallow } from "zustand/shallow";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { ScrollArea } from "../ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import EditEdgeRow from "./EditEdgeRow";
import EditRow from "./EditRow";

const EditPanel = () => {
  const points = useFloorStore(useShallow((state) => state.points));
  const edges = useFloorStore(useShallow((state) => state.edges));
  const triggerAddPoint = useFloorStore(
    useShallow((state) => state.triggerAddPoint)
  );
  const triggerAddJunction = useFloorStore(
    useShallow((state) => state.triggerAddJunction)
  );
  const addEdge = useFloorStore(useShallow((state) => state.addEdge));
  const pendingAdd = useFloorStore(useShallow((state) => state.pendingAdd));
  const junctionAdd = useFloorStore(useShallow((state) => state.junctionAdd));

  const [search, setSearch] = useState("");

  return (
    <div className="absolute top-2 left-2 py-2 bg-zinc-800/50 z-[10] rounded-md backdrop-blur-[5px]">
      <Tabs defaultValue="points">
        <TabsList className="mx-2 mb-2">
          <TabsTrigger value="points">Points</TabsTrigger>
          <TabsTrigger value="edges">Edges</TabsTrigger>
        </TabsList>
        <TabsContent value="points" className="flex flex-col gap-2">
          <ScrollArea className="h-[400px] px-2">
            <table>
              <tbody>
                {points
                  .toSorted((a, b) => b.id - a.id)
                  .filter((point) =>
                    search
                      ? point.name.toLowerCase().includes(search.toLowerCase())
                      : true
                  )
                  .map((point) => (
                    <EditRow key={point.id} data={point} />
                  ))}
              </tbody>
            </table>
          </ScrollArea>
          <div className="px-2 grid grid-flow-row gap-1">
            <Input
              value={search}
              placeholder="Search Name"
              onChange={(e) => setSearch(e.currentTarget.value)}
            />
            <Button
              className="w-full"
              variant={"outline"}
              onClick={() => triggerAddPoint()}
              disabled={pendingAdd}
            >
              + Add Point
            </Button>
            <Button
              className="w-full"
              variant={"outline"}
              onClick={() => triggerAddJunction()}
            >
              {!junctionAdd
                ? "Adding point as Point"
                : "Adding point as Junction"}
            </Button>
          </div>
        </TabsContent>
        <TabsContent value="edges" className="flex flex-col gap-2">
          <ScrollArea className="h-[400px] px-2">
            <table>
              <tbody>
                {edges
                  .toSorted((a, b) => b.id - a.id)
                  .filter((edge) =>
                    search
                      ? edge.from
                          .toLowerCase()
                          .includes(search.toLowerCase()) ||
                        edge.to.toLowerCase().includes(search.toLowerCase())
                      : true
                  )
                  .map((edge) => (
                    <EditEdgeRow key={edge.id} data={edge} options={points} />
                  ))}
              </tbody>
            </table>
          </ScrollArea>
          <div className="px-2 grid grid-flow-row gap-1">
            <Input
              value={search}
              placeholder="Search Name"
              onChange={(e) => setSearch(e.currentTarget.value)}
            />
            <Button
              className="w-full"
              variant={"outline"}
              onClick={() =>
                addEdge({
                  id: -1,
                  from: points[0].name,
                  to: points[1].name,
                  fromId: points[0].id,
                  toId: points[1].id,
                })
              }
            >
              + Add Edge
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EditPanel;
