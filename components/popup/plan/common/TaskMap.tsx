import { Model } from "@/@shared";
import { Util } from "@/common";
import { Icon } from "@/components";
import { ConfigProvider, InputNumber } from "antd";
import classNames from "classnames";
import { useState } from "react";
import { TbCirclePlus, TbSquareX, TbX } from "react-icons/tb";

const DUMMY: ItemDataType[] = [
  {
    taskId: 1,
    taskNo: "2021-0001",
    type: "CONVERTING",
    parent: null,
  },
  {
    taskId: 2,
    taskNo: "2021-0002",
    type: "GUILLOTINE",
    parent: 1,
  },
  {
    taskId: 3,
    taskNo: "2021-0003",
    type: "CONVERTING",
    parent: 1,
  },
  {
    taskId: 4,
    taskNo: "2021-0004",
    type: "CONVERTING",
    parent: null,
  },
  {
    taskId: 5,
    taskNo: "2021-0005",
    type: "GUILLOTINE",
    parent: 4,
  },
  {
    taskId: 6,
    taskNo: "2021-0006",
    type: "GUILLOTINE",
    parent: 2,
  },
  {
    taskId: 7,
    taskNo: "2021-0007",
    type: "GUILLOTINE",
    parent: 2,
  },
];

interface ItemDataType {
  taskId: number;
  taskNo: string;
  type: Model.Enum.TaskType;
  parent: number | null;
}

interface TempDataType {
  taskId: number;
  taskNo: string;
  type: Model.Enum.TaskType;
  childs: TempDataType[];
}

function convert(data: ItemDataType[]): TempDataType[] {
  const temp: TempDataType[] = [];
  const map: { [key: number]: TempDataType } = {};

  data.forEach((item) => {
    map[item.taskId] = { ...item, childs: [] };
  });

  data.forEach((item) => {
    if (item.parent === null) {
      temp.push(map[item.taskId]);
    } else {
      map[item.parent].childs.push(map[item.taskId]);
    }
  });

  return temp;
}

interface Props {}

export default function Component(props: Props) {
  const converted = convert(DUMMY);
  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex-1 flex flex-col p-4 gap-y-4 overflow-y-scroll">
        {converted.map((item) => (
          <Item data={item} key={item.taskId} edge={false} />
        ))}
      </div>
    </div>
  );
}

interface ItemProps {
  data: TempDataType;
  edge: boolean;
}

function Item(props: ItemProps) {
  return (
    <div className="flex-initial flex-shrink-0">
      <div className="flex gap-x-4 relative">
        {props.edge ? (
          <>
            <div className="absolute top-1/2 -left-4 w-4 h-px bg-gray-800">
              <div className="-mx-1 -my-1 w-2 h-2 place-self-center bg-white border border-solid border-gray-800 rounded-full" />
            </div>
          </>
        ) : null}
        <div className="flex-initial flex-shrink-0 basis-64 flex flex-col border border-solid border-gray-800 rounded shadow-xl bg-white overflow-hidden">
          <div
            className={classNames(
              "flex-initial flex gap-x-1 p-2 text-white font-bold",
              {
                "bg-purple-800": props.data.type === "CONVERTING",
                "bg-green-800": props.data.type === "GUILLOTINE",
              }
            )}
          >
            <div className="flex-initial flex flex-col justify-center text-2xl">
              <Icon.TaskType taskType={props.data.type} />
            </div>
            <div className="flex-1">
              {Util.taskTypeToString(props.data.type)}
            </div>
            <div className="flex-initial flex flex-col justify-center text-2xl cursor-pointer hover:text-red-600">
              <TbX />
            </div>
          </div>
          <div className="flex-auto p-4">
            {props.data.type === "CONVERTING" && <ConvertingNode />}
          </div>
        </div>
        <div className="flex-initial flex-shrink-0 flex flex-col justify-end gap-y-4">
          {props.data.childs.map((item) => {
            return <Item data={item} key={item.taskId} edge={true} />;
          })}
          {props.data.type === "CONVERTING" && <AddNode type="GUILLOTINE" />}
          {Util.inc(props.data.type, "CONVERTING", "GUILLOTINE") && (
            <AddNode type="QUANTITY" />
          )}
        </div>
      </div>
    </div>
  );
}

interface AddNodeProps {
  type: Model.Enum.TaskType;
}

function AddNode(props: AddNodeProps) {
  return (
    <div className="flex-initial">
      <div className="flex gap-x-4 relative">
        <div className="absolute top-1/2 -left-4 w-4 h-px bg-gray-600" />
        <div
          className={classNames(
            "flex-initial flex pl-1 pr-2 gap-x-0.5 border border-solid border-gray-800 rounded-full overflow-hidden cursor-pointer select-none bg-white",
            {
              "border-purple-600 text-purple-600": props.type === "CONVERTING",
              "border-green-600 text-green-600": props.type === "GUILLOTINE",
              "border-orange-600 text-orange-600": props.type === "QUANTITY",
            }
          )}
        >
          <div className="flex-initial flex flex-col justify-center">
            <TbCirclePlus />
          </div>
          <div className="flex-initial -mt-px">
            {Util.taskTypeToString(props.type)}
          </div>
        </div>
      </div>
    </div>
  );
}

interface MiniFormProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  unit?: string;
}
function MiniFormNumber(props: MiniFormProps) {
  return (
    <div className="flex-initial flex">
      <div className="basis-16 flex flex-col justify-center">{props.label}</div>
      <div className="flex-1">
        <InputNumber
          value={props.value}
          onChange={(p) => props.onChange(p ?? 0)}
          min={0}
          max={9999}
          precision={0}
          rootClassName="w-full"
          addonAfter={props.unit}
        />
      </div>
    </div>
  );
}

interface ConvertingProps {}
function ConvertingNode(props: ConvertingProps) {
  const [w, setW] = useState(0);
  const [h, setH] = useState(0);

  return (
    <div className="flex-initial flex flex-col gap-y-2">
      <ConfigProvider theme={{ token: { borderRadius: 999 } }}>
        <MiniFormNumber
          label="공정 지폭"
          value={w}
          onChange={(p) => setW(p ?? 0)}
          unit="mm"
        />
        <MiniFormNumber
          label="공정 지장"
          value={h}
          onChange={(p) => setH(p ?? 0)}
          unit="mm"
        />
      </ConfigProvider>
    </div>
  );
}
