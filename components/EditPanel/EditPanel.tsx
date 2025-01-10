"use client";

import { useFloorStore } from "@/lib/zus-store";
import { useShallow } from "zustand/shallow";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import EditEdgeRow from "./EditEdgeRow";
import EditRow from "./EditRow";

type Props = {};

const EditPanel = (props: Props) => {
  // const { id, points, edges } = useFloorStore();

  const points = useFloorStore(useShallow((state) => state.points));
  const edges = useFloorStore(useShallow((state) => state.edges));
  const triggerAddPoint = useFloorStore(
    useShallow((state) => state.triggerAddPoint)
  );
  const addEdge = useFloorStore(useShallow((state) => state.addEdge));
  const pendingAdd = useFloorStore(useShallow((state) => state.pendingAdd));

  // console.log(edges);

  // if (id === "default") return <></>;

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
                  .map((point) => (
                    <EditRow key={point.id} data={point} />
                  ))}
              </tbody>
            </table>
          </ScrollArea>
          <div className="px-2">
            <Button
              className="w-full"
              variant={"outline"}
              onClick={() => triggerAddPoint()}
              disabled={pendingAdd}
            >
              + Add Point
            </Button>
          </div>
        </TabsContent>
        <TabsContent value="edges" className="flex flex-col gap-2">
          <ScrollArea className="h-[400px] px-2">
            <table>
              <tbody>
                {edges
                  .toSorted((a, b) => b.id - a.id)
                  .map((edge) => (
                    <EditEdgeRow key={edge.id} data={edge} options={points} />
                  ))}
              </tbody>
            </table>
          </ScrollArea>
          <div className="px-2">
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
