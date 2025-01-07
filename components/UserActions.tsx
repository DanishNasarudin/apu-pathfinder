"use client";

import { createURL } from "@/lib/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import DropdownSearch from "./DropdownSearch";
import { Button } from "./ui/button";

type Props = {
  allPoints: string[];
  floors: string[];
};

const UserActions = ({ allPoints, floors }: Props) => {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [floor, setFloor] = useState("");
  const [edit, setEdit] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const setSearchParams = new URLSearchParams(searchParams);

  useEffect(() => {
    if (start) {
      setSearchParams.set("start", start);
    } else {
      setSearchParams.delete("start");
    }
    if (end) {
      setSearchParams.set("end", end);
    } else {
      setSearchParams.delete("end");
    }
    if (floor) {
      setSearchParams.set("floor", floor);
    } else {
      setSearchParams.delete("floor");
    }
    if (edit) {
      setSearchParams.set("edit", "true");
    } else {
      setSearchParams.delete("edit");
    }

    const setURL = createURL(`${pathname}/`, setSearchParams);
    router.push(setURL);
  }, [pathname, searchParams, start, end, floor, edit]);

  const handleChangeValue = (newValue: string, id: string) => {
    switch (id) {
      case "start":
        setStart(newValue);
        break;
      case "end":
        setEnd(newValue);
        break;
      case "floor":
        setFloor(newValue);
        break;
      default:
        throw new Error("Invalid ID.");
    }
  };

  return (
    <div className="flex gap-2 w-full md:flex-row flex-col justify-center items-center">
      <DropdownSearch
        id="start"
        lists={allPoints}
        onValueChange={handleChangeValue}
      />
      <DropdownSearch
        id="end"
        lists={allPoints}
        onValueChange={handleChangeValue}
      />
      <DropdownSearch
        id="floor"
        lists={floors}
        onValueChange={handleChangeValue}
      />
      <Button onClick={() => setEdit(!edit)}>
        {edit ? "Exit Editing Mode" : "Edit"}
      </Button>
    </div>
  );
};

export default UserActions;
