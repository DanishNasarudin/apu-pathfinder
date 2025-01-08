"use client";

import { useFloorStore } from "@/lib/zus-store";
import { useShallow } from "zustand/shallow";
import EditRow from "./EditRow";

type Props = {};

const EditPanel = (props: Props) => {
  // const { id, points, edges } = useFloorStore();

  const points = useFloorStore(useShallow((state) => state.points));

  // if (id === "default") return <></>;

  return (
    <div className="absolute top-0 left-0 bg-red-400/20 z-[10]">
      <table>
        <tbody>
          {points.map((point) => (
            <EditRow key={point.id} data={point} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EditPanel;
