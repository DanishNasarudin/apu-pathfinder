import { FloorType } from "@/services/localCrud";

type Props = {
  floor: FloorType;
  width?: number;
  height?: number;
  svg: JSX.Element;
};

const FloorRenderer = ({ floor, width = 500, height = 500, svg }: Props) => {
  // const floor = floors.find((f) => f.id === floorId);

  return (
    <svg
      width={"100%"}
      viewBox={`0 0 ${width} ${height}`}
      style={{ position: "absolute", top: 0, left: 0, zIndex: 2 }}
      className=" [&>path]:dark:stroke-white [&>g]:dark:stroke-white [&>text]:dark:fill-white"
    >
      {svg}
    </svg>
  );
};

export default FloorRenderer;
