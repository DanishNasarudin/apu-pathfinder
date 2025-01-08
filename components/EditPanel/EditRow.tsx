"use client";
import { useFloorStore } from "@/lib/zus-store";
import { Point } from "@/services/localCrud";
import { ChangeEvent, memo } from "react";
import { useShallow } from "zustand/shallow";
import DropdownSearch from "../DropdownSearch";
import { Input } from "../ui/input";

type Props = { data?: Point };

const EditRow = ({
  data = { id: -1, type: "point", name: "default", x: 0, y: 0 },
}: Props) => {
  const updatePoint = useFloorStore(useShallow((state) => state.updatePoint));

  if (data.id === -1) return <></>;

  const handleValueChange = (newValue: string, id: string) => {
    if (id === "type") {
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.currentTarget.value;

    updatePoint({ ...data, name: newValue });
  };

  return (
    <tr>
      <td>
        <DropdownSearch
          id="type"
          lists={["point", "junction"]}
          onValueChange={handleValueChange}
          width="w-[150px]"
        />
      </td>
      <td>
        <Input value={data.name} onChange={handleInputChange} />
      </td>
    </tr>
  );
};

export default memo(EditRow);
