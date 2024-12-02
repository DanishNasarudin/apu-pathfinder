export type Point = {
  type: "point" | "junction";
  id: string;
  x: number;
  y: number;
};

export type Edge = {
  from: string;
  to: string;
};

type FloorType = {
  id: string;
  points: Point[];
  edges: Edge[];
  svg: JSX.Element;
};

export const floors: FloorType[] = [
  {
    id: "Floor 1",
    points: [
      { type: "point", id: "A1", x: -40, y: 190 },
      { type: "junction", id: "B1", x: -60, y: 190 },
      { type: "point", id: "C1", x: -80, y: 190 },
      { type: "junction", id: "D1", x: -60, y: 90 },
      { type: "point", id: "E1", x: -80, y: 90 },
      { type: "point", id: "F1", x: -40, y: 90 },
      { type: "junction", id: "G1", x: -60, y: 40 },
      { type: "junction", id: "FG1", x: 30, y: 40 },
      { type: "point", id: "SD1", x: 30, y: 20 },
      { type: "junction", id: "FT1", x: 80, y: 40 },
      { type: "point", id: "FS1", x: 80, y: 20 },
      { type: "point", id: "Lift1", x: 80, y: 60 },
    ],
    edges: [
      { from: "A1", to: "B1" },
      { from: "B1", to: "C1" },
      { from: "B1", to: "C1" },
      { from: "B1", to: "D1" },
      { from: "D1", to: "F1" },
      { from: "D1", to: "E1" },
      { from: "D1", to: "G1" },
      { from: "G1", to: "FG1" },
      { from: "FG1", to: "SD1" },
      { from: "FG1", to: "FT1" },
      { from: "FT1", to: "FS1" },
      { from: "FT1", to: "Lift1" },
    ],
    svg: (
      <>
        <rect
          className="fill-green-300"
          x="75.37"
          y="36.3"
          width="95.27"
          height="50.89"
        />
        <rect
          className="fill-green-500"
          x="75.37"
          y="87.18"
          width="95.27"
          height="50.89"
        />
        <rect
          className="fill-green-700"
          x="75.37"
          y="138.07"
          width="95.27"
          height="50.89"
        />
        <rect
          className="fill-green-300"
          x="183.95"
          y="251.68"
          width="95.27"
          height="50.89"
          transform="translate(-45.54 508.71) rotate(-90)"
        />
        <rect
          className="fill-green-500"
          x="234.84"
          y="251.68"
          width="95.27"
          height="50.89"
          transform="translate(5.35 559.6) rotate(-90)"
        />
        <rect
          className="fill-green-700"
          x="285.73"
          y="251.68"
          width="95.27"
          height="50.89"
          transform="translate(56.24 610.49) rotate(-90)"
        />
        <rect
          className="fill-green-300"
          x="31.29"
          y="251.68"
          width="95.27"
          height="50.89"
          transform="translate(-198.2 356.05) rotate(-90)"
        />
        <rect
          className="fill-green-500"
          x="82.18"
          y="251.68"
          width="95.27"
          height="50.89"
          transform="translate(-147.31 406.93) rotate(-90)"
        />
        <rect
          className="fill-green-700"
          x="133.07"
          y="251.68"
          width="95.27"
          height="50.89"
          transform="translate(-96.43 457.82) rotate(-90)"
        />
        <rect
          className="fill-green-300"
          x="212.65"
          y="36.3"
          width="95.27"
          height="50.89"
        />
        <rect
          className="fill-green-500"
          x="212.65"
          y="87.18"
          width="95.27"
          height="50.89"
        />
        <rect
          className="fill-green-700"
          x="212.65"
          y="138.07"
          width="95.27"
          height="50.89"
        />
        <rect
          className="fill-green-300"
          x="285.73"
          y="115.88"
          width="95.27"
          height="50.89"
          transform="translate(192.04 474.69) rotate(-90)"
        />
        <rect
          className="fill-green-500"
          x="336.62"
          y="115.88"
          width="95.27"
          height="50.89"
          transform="translate(242.92 525.57) rotate(-90)"
        />
        <rect
          className="fill-green-700"
          x="387.5"
          y="115.88"
          width="95.27"
          height="50.89"
          transform="translate(293.81 576.46) rotate(-90)"
        />
      </>
    ),
  },
  {
    id: "Floor 2",
    points: [
      { type: "point", id: "A2", x: -40, y: 190 },
      { type: "junction", id: "B2", x: -60, y: 190 },
      { type: "point", id: "C2", x: -80, y: 190 },
      { type: "junction", id: "D2", x: -60, y: 90 },
      { type: "point", id: "E2", x: -80, y: 90 },
      { type: "point", id: "F2", x: -40, y: 90 },
      { type: "junction", id: "G2", x: -60, y: 40 },
      { type: "junction", id: "FG2", x: 30, y: 40 },
      { type: "point", id: "SD2", x: 30, y: 20 },
      { type: "junction", id: "FT2", x: 80, y: 40 },
      { type: "point", id: "FS2", x: 80, y: 20 },
      { type: "point", id: "Lift2", x: 80, y: 60 },
    ],
    edges: [
      { from: "A2", to: "B2" },
      { from: "B2", to: "C2" },
      { from: "B2", to: "C2" },
      { from: "B2", to: "D2" },
      { from: "D2", to: "F2" },
      { from: "D2", to: "E2" },
      { from: "D2", to: "G2" },
      { from: "G2", to: "FG2" },
      { from: "FG2", to: "SD2" },
      { from: "FG2", to: "FT2" },
      { from: "FT2", to: "FS2" },
      { from: "FT2", to: "Lift2" },
    ],
    svg: (
      <>
        <rect
          className="fill-red-300"
          x="75.37"
          y="36.3"
          width="95.27"
          height="50.89"
        />
        <rect
          className="fill-red-500"
          x="75.37"
          y="87.18"
          width="95.27"
          height="50.89"
        />
        <rect
          className="fill-red-700"
          x="75.37"
          y="138.07"
          width="95.27"
          height="50.89"
        />
        <rect
          className="fill-red-300"
          x="183.95"
          y="251.68"
          width="95.27"
          height="50.89"
          transform="translate(-45.54 508.71) rotate(-90)"
        />
        <rect
          className="fill-red-500"
          x="234.84"
          y="251.68"
          width="95.27"
          height="50.89"
          transform="translate(5.35 559.6) rotate(-90)"
        />
        <rect
          className="fill-red-700"
          x="285.73"
          y="251.68"
          width="95.27"
          height="50.89"
          transform="translate(56.24 610.49) rotate(-90)"
        />
        <rect
          className="fill-red-300"
          x="31.29"
          y="251.68"
          width="95.27"
          height="50.89"
          transform="translate(-198.2 356.05) rotate(-90)"
        />
        <rect
          className="fill-red-500"
          x="82.18"
          y="251.68"
          width="95.27"
          height="50.89"
          transform="translate(-147.31 406.93) rotate(-90)"
        />
        <rect
          className="fill-red-700"
          x="133.07"
          y="251.68"
          width="95.27"
          height="50.89"
          transform="translate(-96.43 457.82) rotate(-90)"
        />
        <rect
          className="fill-red-300"
          x="212.65"
          y="36.3"
          width="95.27"
          height="50.89"
        />
        <rect
          className="fill-red-500"
          x="212.65"
          y="87.18"
          width="95.27"
          height="50.89"
        />
        <rect
          className="fill-red-700"
          x="212.65"
          y="138.07"
          width="95.27"
          height="50.89"
        />
        <rect
          className="fill-red-300"
          x="285.73"
          y="115.88"
          width="95.27"
          height="50.89"
          transform="translate(192.04 474.69) rotate(-90)"
        />
        <rect
          className="fill-red-500"
          x="336.62"
          y="115.88"
          width="95.27"
          height="50.89"
          transform="translate(242.92 525.57) rotate(-90)"
        />
        <rect
          className="fill-red-700"
          x="387.5"
          y="115.88"
          width="95.27"
          height="50.89"
          transform="translate(293.81 576.46) rotate(-90)"
        />
      </>
    ),
  },
];
