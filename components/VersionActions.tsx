import { VersionType } from "@/services/versionCrud";

type Props = {
  data?: VersionType[];
};

const VersionActions = ({ data = [] }: Props) => {
  //   if (data.length === 0) return <></>;

  return (
    <div className="max-w-[500px] w-full mt-16 flex flex-col gap-2 px-2">
      <span className="font-bold text-lg">Updates</span>
      <div className="w-full h-[1px] bg-zinc-800"></div>
      <table className="max-w-[500px] w-full">
        <tbody>
          <tr>
            <td className="text-zinc-500">13th Jan 2025</td>
            <td>Completed Floor 6 & Floor 7</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default VersionActions;
