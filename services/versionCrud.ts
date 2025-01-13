"use server";
import { handleError } from "@/lib/utils";
import fs from "fs/promises";
import path from "path";

const DATA_FILE_PATH = path.join(process.cwd(), "data", "versions.json");

export type VersionType = {
  id: number;
  timestamp: string;
  description: string;
};

const readData = async (): Promise<VersionType[]> => {
  try {
    const data = await fs.readFile(DATA_FILE_PATH, "utf-8");
    return JSON.parse(data) as VersionType[];
  } catch (err) {
    if (
      err instanceof Error &&
      (err as NodeJS.ErrnoException).code === "ENOENT"
    ) {
      await fs.writeFile(DATA_FILE_PATH, JSON.stringify([]), "utf-8");
      return [];
    }
    if (err instanceof Error) {
      console.error("Error reading data file:", err.message);
    } else {
      console.error("Unknown error reading data file.");
    }
    throw err;
  }
};

const writeData = async (data: VersionType[]): Promise<void> => {
  await fs.writeFile(DATA_FILE_PATH, JSON.stringify(data, null, 2), "utf-8");
};

export const getData = async () => {
  const data = await readData();
  return data;
};

export const updateData = async (input: VersionType) => {
  const data = await readData();
  const index = data.findIndex((version) => version.id === input.id);
  if (index === -1) {
    handleError(`Version not found`);
  }
  data[index] = input;
  await writeData(data);
};
