"use server";
import fs from "fs/promises";
import path from "path";

const DATA_FILE_PATH = path.join(process.cwd(), "data", "floors.json");

export type Point = {
  id: number;
  type: "point" | "junction";
  name: string;
  x: number;
  y: number;
};

export type Edge = {
  id: number;
  from: string;
  to: string;
  fromId: number;
  toId: number;
};

export type FloorType = {
  id: string;
  points: Point[];
  edges: Edge[];
  // svg: JSX.Element;
};

// Helper to read and write data
const readData = async (): Promise<FloorType[]> => {
  try {
    const data = await fs.readFile(DATA_FILE_PATH, "utf-8");
    return JSON.parse(data) as FloorType[];
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

const writeData = async (data: FloorType[]): Promise<void> => {
  await fs.writeFile(DATA_FILE_PATH, JSON.stringify(data, null, 2), "utf-8");
};

// CRUD Functions

// CREATE
export const createData = async (input: FloorType) => {
  const data = await readData();

  const isExist = data.find((item) => item.id === input.id);
  if (isExist) throw new Error(`Data already exist! Data creation failed.`);

  data.push(input);
  await writeData(data);
};

// READ
export const getData = async () => {
  const data = await readData();
  return data;
};

// UPDATE
export const updateData = async (input: FloorType) => {
  const data = await readData();
  const index = data.findIndex((floor) => floor.id === input.id);
  if (index === -1) {
    throw new Error(`Floor not found`);
  }
  data[index] = input;
  await writeData(data);
};

// DELETE
export const deleteData = async ({ id }: { id: string }) => {
  const data = await readData();
  const filteredData = data.filter((floor) => floor.id !== id);
  if (data.length === filteredData.length) {
    throw new Error(`Floor not found`);
  }
  await writeData(filteredData);
};
