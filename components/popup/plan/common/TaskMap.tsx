import { Model } from "@/@shared";
import { ApiHook, Util } from "@/common";
import { Icon } from "@/components";
import { ConfigProvider, InputNumber } from "antd";
import classNames from "classnames";
import { useCallback, useState } from "react";
import { TbCirclePlus, TbX } from "react-icons/tb";

interface TempDataType {
  value: Model.Task;
  childs: TempDataType[];
}

function convert(data: Model.Task[]): TempDataType[] {
  const temp: TempDataType[] = [];
  const map = new Map<number, TempDataType>();

  data.forEach((item) => {
    map.set(item.id, { value: item, childs: [] });
  });

  data.forEach((item) => {
    const tempItem = map.get(item.id);
    if (!tempItem) {
      return;
    }

    if (item.parentTaskId === null) {
      temp.push(tempItem);
    } else {
      map.get(item.parentTaskId)?.childs.push(tempItem);
    }
  });

  return temp;
}

interface Props {
  plan: Model.Plan;
  packagingType: Model.Enum.PackagingType;
}

export default function Component(props: Props) {
  const tasks = ApiHook.Working.Plan.useGetTaskList({
    planId: props.plan.id,
  });
  const converted = convert(tasks.data ?? []);
  return (
    <div className="w-auto h-full flex">
      <div className="flex-1 flex flex-col p-4 overflow-y-scroll">
        <div className="flex-initial flex flex-col gap-y-4">
          {converted.map((item) => (
            <Item
              data={item}
              key={item.value.id}
              plan={props.plan}
              edge={false}
            />
          ))}
        </div>
        {props.packagingType === "ROLL" && (
          <AddNode type="CONVERTING" plan={props.plan} parentTaskId={null} />
        )}
        {props.packagingType !== "ROLL" && (
          <AddNode type="GUILLOTINE" plan={props.plan} parentTaskId={null} />
        )}
        {props.packagingType !== "ROLL" &&
          !converted.some((p) => p.value.type === "QUANTITY") && (
            <AddNode type="QUANTITY" plan={props.plan} parentTaskId={null} />
          )}
      </div>
    </div>
  );
}

interface ItemProps {
  plan: Model.Plan;
  data: TempDataType;
  edge: boolean;
}

function Item(props: ItemProps) {
  const apiDelete = ApiHook.Working.Task.useDelete();
  const cmdDelete = useCallback(async () => {
    await apiDelete.mutateAsync({
      id: props.data.value.id,
      planId: props.plan.id,
    });
  }, [apiDelete, props.data.value.id]);

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
              "flex-initial flex gap-x-1 p-2 text-white font-bold select-none",
              {
                "bg-purple-800": props.data.value.type === "CONVERTING",
                "bg-green-800": props.data.value.type === "GUILLOTINE",
                "bg-orange-800": props.data.value.type === "QUANTITY",
              }
            )}
          >
            <div className="flex-initial flex flex-col justify-center text-2xl">
              <Icon.TaskType taskType={props.data.value.type} />
            </div>
            <div className="flex-1">
              {Util.taskTypeToString(props.data.value.type)}
            </div>
            <div
              className="flex-initial flex flex-col justify-center text-2xl cursor-pointer hover:text-red-600"
              onClick={() => cmdDelete()}
            >
              <TbX />
            </div>
          </div>
          <div className="flex-auto p-4">
            {props.data.value.taskConverting && (
              <ConvertingNode
                taskId={props.data.value.id}
                data={props.data.value.taskConverting}
              />
            )}
            {props.data.value.taskGuillotine && (
              <GuillotineNode
                taskId={props.data.value.id}
                data={props.data.value.taskGuillotine}
              />
            )}
            {props.data.value.taskQuantity && (
              <QuantityNode
                taskId={props.data.value.id}
                data={props.data.value.taskQuantity}
              />
            )}
          </div>
        </div>
        <div className="flex-initial flex-shrink-0 flex flex-col">
          <div className="flex-1 flex flex-col gap-y-4">
            {props.data.childs.map((item) => {
              return (
                <Item
                  data={item}
                  plan={props.plan}
                  key={item.value.id}
                  edge={true}
                />
              );
            })}
          </div>
          <div className="flex-initial flex flex-col">
            {props.data.value.type === "CONVERTING" && (
              <AddNode
                type="GUILLOTINE"
                plan={props.plan}
                parentTaskId={props.data.value.id}
              />
            )}
            {props.data.childs.length === 0 &&
              Util.inc(props.data.value.type, "CONVERTING", "GUILLOTINE") && (
                <AddNode
                  type="QUANTITY"
                  plan={props.plan}
                  parentTaskId={props.data.value.id}
                />
              )}
          </div>
        </div>
      </div>
    </div>
  );
}

interface AddNodeProps {
  plan: Model.Plan;
  parentTaskId: number | null;
  type: Model.Enum.TaskType;
}

function AddNode(props: AddNodeProps) {
  const apiCreateConverting = ApiHook.Working.Task.useCreateConverting();
  const apiCreateGuillotine = ApiHook.Working.Task.useCreateGuillotine();
  const apiCreateQuantity = ApiHook.Working.Task.useCreateQuantity();

  const cmdCreate = useCallback(async () => {
    switch (props.type) {
      case "CONVERTING": {
        const res = await apiCreateConverting.mutateAsync({
          data: {
            planId: props.plan.id,
            parentTaskId: props.parentTaskId,
            sizeX: props.plan.targetStockGroupEvent.stockGroup.sizeX,
            sizeY: props.plan.targetStockGroupEvent.stockGroup.sizeY,
            memo: "",
          },
        });
        break;
      }
      case "GUILLOTINE": {
        const res = await apiCreateGuillotine.mutateAsync({
          data: {
            planId: props.plan.id,
            parentTaskId: props.parentTaskId,
            sizeX: props.plan.targetStockGroupEvent.stockGroup.sizeX,
            sizeY: props.plan.targetStockGroupEvent.stockGroup.sizeY,
            memo: "",
          },
        });
        break;
      }
      case "QUANTITY": {
        const res = await apiCreateQuantity.mutateAsync({
          data: {
            planId: props.plan.id,
            parentTaskId: props.parentTaskId,
            quantity: 0,
          },
        });
        break;
      }
    }
  }, [props, apiCreateConverting, apiCreateGuillotine, apiCreateQuantity]);

  return (
    <div className="flex-initial mt-4">
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
          onClick={() => cmdCreate()}
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
  onChange?: (value: number) => void;
  unit?: string;
  disabled?: boolean;
}
function MiniFormNumber(props: MiniFormProps) {
  return (
    <div className="flex-initial flex">
      <div className="basis-16 flex flex-col justify-center">{props.label}</div>
      <div className="flex-1">
        <InputNumber
          value={props.value}
          onChange={(p) => props.onChange?.(p ?? 0)}
          min={0}
          max={9999}
          precision={0}
          rootClassName="w-full"
          addonAfter={props.unit}
          disabled={props.disabled}
        />
      </div>
    </div>
  );
}

interface MiniButtonProps {
  label: string;
  onClick?: () => Promise<void>;
}
function MiniButton(props: MiniButtonProps) {
  const [pending, setPending] = useState(false);
  const cmdClick = useCallback(async () => {
    try {
      setPending(true);
      await props.onClick?.();
    } catch (err) {
      console.warn(err);
    } finally {
      setPending(false);
    }
  }, [props.onClick]);

  return (
    <div className="flex-initial flex justify-end">
      <button
        className={classNames(
          "px-4 py-1 flex flex-row justify-center border border-solid select-none rounded-full",
          {
            "bg-gray-600 hover:bg-gray-600 text-gray-400 cursor-not-allowed":
              pending,
            "bg-cyan-800 hover:bg-cyan-700 text-white border-cyan-900 hover:border-cyan-800":
              !pending,
          }
        )}
        disabled={pending}
        onClick={() => cmdClick()}
      >
        {props.label}
      </button>
    </div>
  );
}

interface ConvertingProps {
  taskId: number;
  data: Model.TaskConverting;
}
function ConvertingNode(props: ConvertingProps) {
  const [initialW, setInitialW] = useState(props.data.sizeX);
  const [initialH, setInitialH] = useState(props.data.sizeY);
  const [w, setW] = useState(props.data.sizeX);
  const [h, setH] = useState(props.data.sizeY);

  const apiUpdate = ApiHook.Working.Task.useUpdateConverting();
  const cmdUpdate = useCallback(async () => {
    await apiUpdate.mutateAsync({
      taskId: props.taskId,
      data: {
        sizeX: w,
        sizeY: h,
        memo: "",
      },
    });
    setInitialW(w);
    setInitialH(h);
  }, [props.taskId, w, h, apiUpdate]);

  const isChanged = useCallback(() => {
    return initialW !== w || initialH !== h;
  }, [initialW, initialH, w, h]);

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
        {isChanged() && (
          <MiniButton label="저장" onClick={async () => await cmdUpdate()} />
        )}
      </ConfigProvider>
    </div>
  );
}

interface GuillotineProps {
  taskId: number;
  data: Model.TaskGuillotine;
}
function GuillotineNode(props: GuillotineProps) {
  const [initialW, setInitialW] = useState(props.data.sizeX);
  const [initialH, setInitialH] = useState(props.data.sizeY);
  const [w, setW] = useState(props.data.sizeX);
  const [h, setH] = useState(props.data.sizeY);

  const apiUpdate = ApiHook.Working.Task.useUpdateGuillotine();
  const cmdUpdate = useCallback(async () => {
    await apiUpdate.mutateAsync({
      taskId: props.taskId,
      data: {
        sizeX: w,
        sizeY: h,
        memo: "",
      },
    });
    setInitialW(w);
    setInitialH(h);
  }, [props.taskId, w, h, apiUpdate]);

  const isChanged = useCallback(() => {
    return initialW !== w || initialH !== h;
  }, [initialW, initialH, w, h]);

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
        {isChanged() && (
          <MiniButton label="저장" onClick={async () => await cmdUpdate()} />
        )}
      </ConfigProvider>
    </div>
  );
}

interface QuantityProps {
  taskId: number;
  data: Model.TaskQuantity;
}
function QuantityNode(props: QuantityProps) {
  const [initialQ, setInitialQ] = useState(props.data.quantity);
  const [q, setQ] = useState(props.data.quantity);

  const apiUpdate = ApiHook.Working.Task.useUpdateQuantity();
  const cmdUpdate = useCallback(async () => {
    await apiUpdate.mutateAsync({
      taskId: props.taskId,
      data: {
        quantity: q,
      },
    });
    setInitialQ(q);
  }, [props.taskId, q, apiUpdate]);

  const isChanged = useCallback(() => {
    return initialQ !== q;
  }, [initialQ, q]);

  return (
    <div className="flex-initial flex flex-col gap-y-2">
      <ConfigProvider theme={{ token: { borderRadius: 999 } }}>
        <MiniFormNumber
          label="출고 수량"
          value={q}
          onChange={(p) => setQ(p ?? 0)}
          unit="매"
        />
        <MiniFormNumber label="중량" value={0} unit="톤" disabled />
        {isChanged() && (
          <MiniButton label="저장" onClick={async () => await cmdUpdate()} />
        )}
      </ConfigProvider>
    </div>
  );
}
