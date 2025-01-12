"use client";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

type Props = {
  id?: string;
  lists?: string[];
  onValueChange?: (newValue: string, id: string) => void;
  width?: string;
};

const DropdownSearch = ({
  id = "default",
  lists = ["A1", "B2"],
  onValueChange = () => {},
  width = "none",
}: Props) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(lists[0] || "");

  useEffect(() => {
    if (value === "") return;

    onValueChange(value, id);
  }, [value]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            width === "none" ? "w-[200px]" : width,
            "justify-between text-ellipsis overflow-hidden"
          )}
        >
          {value ? lists.find((list) => list === value) : "Select list..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className={cn(width === "none" ? "w-[200px]" : width, "p-0")}
      >
        <Command>
          <CommandInput placeholder="Search list..." />
          <CommandList>
            <CommandEmpty>No list found.</CommandEmpty>
            <CommandGroup>
              {lists.map((list) => (
                <CommandItem
                  key={list}
                  value={list}
                  onSelect={(currentValue) => {
                    setValue(currentValue);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === list ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {list}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default DropdownSearch;
