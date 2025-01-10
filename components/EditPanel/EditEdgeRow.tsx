"use client";
import { useFloorStore } from "@/lib/zus-store";
import { Edge, Point } from "@/services/localCrud";
import { MinusIcon } from "lucide-react";
import { memo } from "react";
import { useShallow } from "zustand/shallow";
import DropdownSearch from "../DropdownSearch";
import { Button } from "../ui/button";

type Props = {
  data?: Edge;
  options?: Point[];
};

const EditEdgeRow = ({
  data = {
    id: -1,
    from: "default_from",
    to: "default_to",
    fromId: -1,
    toId: -1,
  },
  options = [],
}: Props) => {
  if (data.id === -1) return <></>;

  const deleteEdge = useFloorStore(useShallow((state) => state.deleteEdge));
  const updateEdge = useFloorStore(useShallow((state) => state.updateEdge));

  const initFrom: string[] = [];
  const initTo: string[] = [];

  if (initFrom.length === 0) {
    initFrom.push(data.from);

    for (let i in options) {
      if (options[i].name !== data.from) initFrom.push(options[i].name);
    }
  }

  if (initTo.length === 0) {
    initTo.push(data.to);

    for (let i in options) {
      if (options[i].name !== data.to) initTo.push(options[i].name);
    }
  }

  const handleValueChange = (newValue: string, id: string) => {
    if (id === "from") {
      updateEdge({
        ...data,
        from: newValue,
        fromId: options.find((item) => item.name === newValue)?.id || -1,
      });
    }

    if (id === "to") {
      updateEdge({
        ...data,
        to: newValue,
        toId: options.find((item) => item.name === newValue)?.id || -1,
      });
    }
  };

  // console.log("PASS", data.id);

  return (
    <tr className="[&>td]:px-1 [&>td:first-child]:pl-0 [&>td:last-child]:pr-0">
      <td>
        <DropdownSearch
          id={"from"}
          lists={initFrom}
          onValueChange={handleValueChange}
          width="w-[150px]"
        />
      </td>
      <td>
        <DropdownSearch
          id={"to"}
          lists={initTo}
          onValueChange={handleValueChange}
          width="w-[150px]"
        />
      </td>
      <td>
        <Button
          variant={"destructive"}
          size={"icon"}
          onClick={() => deleteEdge(data.id)}
        >
          <MinusIcon />
        </Button>
      </td>
    </tr>
  );
};

export default memo(EditEdgeRow);
