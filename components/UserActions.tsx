"use client";

import { createURL } from "@/lib/utils";
import { useFloorStore } from "@/lib/zus-store";
import { updateData } from "@/services/localCrud";
import { DialogDescription } from "@radix-ui/react-dialog";
import { Scanner } from "@yudiel/react-qr-scanner";
import { QrCodeIcon, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import DropdownSearch from "./DropdownSearch";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

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

  const { id, points, edges, reset } = useFloorStore();

  useEffect(() => {
    // console.log("PASS edit", edit, id, points, edges);
    if (id !== "default") {
      // console.log("PASS update");
      updateData({ id, points, edges });
    }
    if (!edit && points.length > 0) {
      reset();
    }
  }, [edit, points, edges]);

  const handleChangeValue = (newValue: string, id: string) => {
    switch (id) {
      case "start": {
        setStart(newValue);
        const startFloor = newValue.match(/(?<=-)\d+(?=-)/);

        if (startFloor) {
          setFloor(`Floor ${parseInt(startFloor[0], 10)}`);
        }
        break;
      }
      case "end": {
        setEnd(newValue);
        const startFloor = start.match(/(?<=-)\d+(?=-)/);

        if (startFloor) {
          setFloor(`Floor ${parseInt(startFloor[0], 10)}`);
        }
        break;
      }
      case "floor":
        setFloor(newValue);
        break;
      default:
        throw new Error("Invalid ID.");
    }
  };

  const startFloorNum = useMemo(() => {
    const startFloor = start.match(/(?<=-)\d+(?=-)/);

    return startFloor ? parseInt(startFloor[0], 10) : null;
  }, [start]);

  const endFloorNum = useMemo(() => {
    const endFloor = end.match(/(?<=-)\d+(?=-)/);
    return endFloor ? parseInt(endFloor[0], 10) : null;
  }, [end]);

  const isProduction = process.env.NODE_ENV === "production";

  const [qrDialog, setQrDialog] = useState(false);
  const [qrError, setQrError] = useState(false);

  return (
    <div className="flex gap-2">
      <div className="flex-1/2 flex flex-col gap-2 text-xs text-foreground/80">
        <div className="h-9 flex items-center">From</div>
        <div className="h-9 flex items-center">To</div>
        <div></div>
      </div>
      <div className="flex-1 flex flex-col gap-2">
        <div className="flex gap-2 max-w-[200px] flex-row-reverse">
          <Dialog open={qrDialog}>
            <DialogTrigger asChild>
              <Button
                size={"icon"}
                variant={"outline"}
                className="p-2"
                onClick={() => setQrDialog(true)}
              >
                <QrCodeIcon />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Scan QR near the Classroom</DialogTitle>
                <Scanner
                  onScan={(result) => {
                    const regex = /^[A-Z]-\d{2}-\d{2}$/;
                    const check = regex.test(result[0].rawValue);
                    // IF THEY SCAN SOMETHING NOT IN THE DB, NEED TO HANDLE
                    if (check) {
                      setStart(result[0].rawValue);
                      setQrDialog(false);
                      setQrError(false);
                    } else {
                      setQrError(true);
                    }
                  }}
                />
              </DialogHeader>
              {qrError && (
                <DialogDescription className="text-red-500">
                  QR Code is not valid!
                </DialogDescription>
              )}
              <Button
                className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
                onClick={() => setQrDialog(false)}
                size={"icon"}
                variant={"ghost"}
              >
                <X className="" />
                <span className="sr-only">Close</span>
              </Button>
            </DialogContent>
          </Dialog>
          <DropdownSearch
            id="start"
            lists={allPoints}
            onValueChange={handleChangeValue}
            valueInput={start}
          />
        </div>
        <DropdownSearch
          id="end"
          lists={allPoints}
          onValueChange={handleChangeValue}
          valueInput={end}
        />
        <DropdownSearch
          id="floor"
          lists={floors}
          onValueChange={handleChangeValue}
          valueInput={floor}
          isStart={startFloorNum ? `Floor ${startFloorNum}` : ""}
          isEnd={endFloorNum ? `Floor ${endFloorNum}` : ""}
        />
      </div>
      {!isProduction ? (
        <Button onClick={() => setEdit(!edit)}>
          {edit ? "Exit Editing Mode" : "Edit"}
        </Button>
      ) : (
        <div className="flex-1/2"></div>
      )}
    </div>
  );
};

export default UserActions;
