"use client";
import { cn } from "@/lib/utils";
import { useFloorStore } from "@/lib/zus-store";
import { useState } from "react";
import { useShallow } from "zustand/shallow";

type Props = {
  x?: number;
  y?: number;
  name?: string;
};

const PointCircle = ({ x = -1, y = -1, name = "default" }: Props) => {
  const [hover, setHover] = useState(false);

  const junctionFrom = useFloorStore(useShallow((state) => state.junctionFrom));
  const setJunctionFrom = useFloorStore(
    useShallow((state) => state.setJunctionFrom)
  );
  const setJunctionTo = useFloorStore(
    useShallow((state) => state.setJunctionTo)
  );

  const handleSetJunction = () => {
    if (junctionFrom === "") {
      setJunctionFrom(name);
    } else {
      setJunctionTo(name);
    }
  };
  return (
    <circle
      cx={x}
      cy={y}
      r={hover ? 2.0 : 1.5}
      fill="red"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={handleSetJunction}
      className={cn(
        junctionFrom === name && "fill-green-500",
        "hover:cursor-pointer"
      )}
    />
  );
};

export default PointCircle;
