"use client";

import { createURL } from "@/lib/utils";
import { useFloorStore } from "@/lib/zus-store";
import { updateData } from "@/services/localCrud";
import { DialogDescription } from "@radix-ui/react-dialog";
import { Scanner } from "@yudiel/react-qr-scanner";
import { QrCode, QrCodeIcon, Share, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useCopyToClipboard } from "usehooks-ts";
import DropdownSearch from "./DropdownSearch";
import QRGenerator from "./qr-generator";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
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
  const [_, copy] = useCopyToClipboard();

  let fullUrl = "";

  if (typeof window !== "undefined") {
    fullUrl = `${window.location.protocol}//${window.location.host}`;
  }

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

  useEffect(() => {
    const paramStart = setSearchParams.get("start");
    const paramEnd = setSearchParams.get("end");
    const paramFloor = setSearchParams.get("floor");

    if (!paramStart || !paramEnd || !paramFloor) return;

    setStart(paramStart);
    setEnd(paramEnd);
    setFloor(paramFloor);
  }, [setSearchParams]);

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

  const urlToCopy = useMemo(
    () => createURL(`${fullUrl}${pathname}`, setSearchParams),
    [fullUrl, pathname, setSearchParams]
  );

  return (
    <div className="flex gap-2">
      <div className="flex-1/2 flex flex-col gap-2 text-xs text-foreground/80">
        <div className="h-9 flex items-center">From</div>
        <div className="h-9 flex items-center">To</div>
        <div></div>
      </div>
      <div className="flex-1 flex flex-col gap-2">
        <div className="flex gap-2 w-full flex-row-reverse">
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
                <DialogDescription>
                  Navigate faster with APU Pathfinder
                </DialogDescription>
              </DialogHeader>
              <Scanner
                onScan={(result) => {
                  const regex = /^[A-Z]-\d{2}-\d{2}$/;
                  const check = regex.test(result[0].rawValue);
                  if (check) {
                    setStart(result[0].rawValue);
                    setQrDialog(false);
                    setQrError(false);
                  } else {
                    setQrError(true);
                  }
                }}
              />
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
            valueInput={start || "B-06-05"}
          />
        </div>
        <DropdownSearch
          id="end"
          lists={allPoints}
          onValueChange={handleChangeValue}
          valueInput={end || "B-06-05"}
        />
        <DropdownSearch
          id="floor"
          lists={floors}
          onValueChange={handleChangeValue}
          valueInput={floor || "Floor 6"}
          isStart={startFloorNum ? `Floor ${startFloorNum}` : ""}
          isEnd={endFloorNum ? `Floor ${endFloorNum}` : ""}
          noSearch
        />
        <div className="flex gap-2">
          <Button
            disabled={start === end}
            onClick={() => {
              copy(urlToCopy);
              toast.success("Copied link!");
            }}
          >
            Share <Share />
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button disabled={start === end}>
                Share QR <QrCode />
              </Button>
            </DialogTrigger>
            <DialogContent className="items-center justify-center">
              <DialogHeader className="justify-center">
                <DialogTitle className="text-center">
                  Scan this QR for Directions!
                </DialogTitle>
                <DialogDescription className="text-center">
                  Navigate faster with APU Pathfinder
                </DialogDescription>
              </DialogHeader>
              <QRGenerator value={urlToCopy} />
              <DialogClose>
                <Button
                  className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
                  size={"icon"}
                  variant={"ghost"}
                >
                  <X className="" />
                  <span className="sr-only">Close</span>
                </Button>
              </DialogClose>
            </DialogContent>
          </Dialog>
        </div>
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
