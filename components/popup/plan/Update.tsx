import { Api, Protocol, Util } from "@/common";
import { Record } from "@/common/protocol";
import { Icon, Popup, Table, Toolbar } from "@/components";
import { Steps } from "antd";
import classNames from "classnames";
import { useCallback, useState } from "react";
import { TbBarcode, TbMarquee2, TbMathFunction } from "react-icons/tb";

type TabType = "input" | "task" | "output";

export interface Props {
  open: number | false;
  onClose: (unit: false) => void;
}

export default function Component(props: Props) {
  const data = Api.Internal.Plan.useGetItem(props.open);
  const [tab, setTab] = useState<TabType>("input");

  const apiNext = Api.Internal.Plan.useNext(props.open);
  const cmdNext = useCallback(async () => {
    const message =
      data.data?.status === "PREPARING"
        ? "작업을 시작하면 작업 계획을 수정할 수 없게 됩니다. 계속하시겠습니까?"
        : data.data?.status === "PROGRESSING"
        ? "작업을 완료하시겠습니까?"
        : data.data?.status === "PROGRESSED"
        ? "출고하시겠습니까?"
        : "";

    if (!(await Util.confirm(message))) return;
    await apiNext.mutateAsync({ data: {} });
  }, [apiNext, data.data?.status]);

  const statusIndex =
    data.data?.status === "PREPARING"
      ? 0
      : data.data?.status === "PROGRESSING"
      ? 1
      : data.data?.status === "PROGRESSED"
      ? 2
      : data.data?.status === "RELEASED"
      ? 3
      : 0;

  return (
    <Popup.Template.Full
      title="작업 계획 상세"
      {...props}
      open={!!props.open}
      width="calc(100vw - 80px)"
      height="calc(100vh - 80px)"
    >
      <div className="flex-1 flex flex-col">
        <div className="flex-initial p-3 flex gap-x-4">
          <div className="flex-1 flex items-center">
            <Steps
              current={statusIndex}
              items={[
                { title: "작업 대기중" },
                { title: "작업중" },
                { title: "출고 대기중" },
                { title: "출고중" },
              ]}
              rootClassName="select-none"
            />
          </div>
          <div className="flex-initial">
            <Toolbar.Container>
              {data.data?.status === "PREPARING" && (
                <Toolbar.ButtonPreset.Continue
                  label="작업 시작"
                  onClick={cmdNext}
                />
              )}
              {data.data?.status === "PROGRESSING" && (
                <Toolbar.ButtonPreset.Continue
                  label="작업 완료"
                  onClick={cmdNext}
                />
              )}
              {data.data?.status === "PROGRESSED" && (
                <Toolbar.ButtonPreset.Continue label="출고" onClick={cmdNext} />
              )}
            </Toolbar.Container>
          </div>
        </div>
        <div className="basis-px bg-gray-200" />
        <div className="flex-1 flex">
          <div className="basis-[200px] p-2 pr-0 flex flex-col gap-y-1 bg-slate-50">
            <Tab
              icon={<TbBarcode />}
              label="실투입"
              tab="input"
              value={tab}
              onClick={setTab}
            />
            <Tab
              icon={<TbMathFunction />}
              label="공정 계획"
              tab="task"
              value={tab}
              onClick={setTab}
            />
            <Tab
              icon={<TbMarquee2 />}
              label="출고 예정 목록"
              tab="output"
              value={tab}
              onClick={setTab}
            />
          </div>
          <div className="basis-px bg-gray-200" />
          {data.data && (
            <>
              {tab === "input" && <Input plan={data.data} />}
              {tab === "task" && <Task plan={data.data} />}
              {tab === "output" && <Output plan={data.data} />}
            </>
          )}
        </div>
      </div>
    </Popup.Template.Full>
  );
}

interface TabProps {
  tab: TabType;
  value: TabType;
  icon: React.ReactNode;
  label: string;
  onClick: (value: TabType) => void;
}

function Tab(props: TabProps) {
  const active = props.tab === props.value;

  return (
    <div
      className={classNames(
        `flex-initial flex items-center cursor-pointer p-3 text-base font-bold gap-x-2 rounded-l border border-solid border-r-0 border-gray-200`,
        {
          "bg-cyan-800 text-white": active,
          "bg-white text-gray-800": !active,
        }
      )}
      onClick={() => props.onClick(props.tab)}
    >
      <div className="flex items-center justify-center text-2xl">
        {props.icon}
      </div>
      <div className="flex-1">{props.label}</div>
    </div>
  );
}

interface InputProps {
  plan: Protocol.Record.Plan;
}
function Input(props: InputProps) {
  return (
    <div className="flex-1 flex flex-col p-4 gap-y-4">
      <Toolbar.Container>
        <Toolbar.ButtonPreset.Create label="실투입 등록" onClick={() => {}} />
      </Toolbar.Container>
      <div className="flex-1">TODO</div>
    </div>
  );
}

interface TaskProps {
  plan: Protocol.Record.Plan;
}
function Task(props: TaskProps) {
  const [openCreate, setOpenCreate] = useState(false);
  const [openUpdateConverting, setOpenUpdateConverting] = useState(false);
  const [openUpdateGuillotine, setOpenUpdateGuillotine] = useState(false);

  const [taskData, page, setPage] = Api.Internal.Plan.useGetTaskList(
    props.plan.id,
    {}
  );

  const [selected, setSelected] = useState<Record.Task[]>([]);
  const only = Util.only(selected);

  const apiDelete = Api.Internal.Plan.useDeleteTask();
  const cmdDelete = useCallback(async () => {
    if (only && (await Util.confirm("선택한 공정 계획을 삭제하시겠습니까?"))) {
      await apiDelete.mutateAsync(only.id);
      setSelected([]);
    }
  }, [apiDelete, only]);

  return (
    <div className="flex-1 flex flex-col p-4 gap-y-4">
      <Toolbar.Container>
        <Toolbar.ButtonPreset.Create
          label="공정 계획 추가"
          onClick={() => setOpenCreate(true)}
        />
        <div className="flex-1" />
        <Toolbar.ButtonPreset.Update
          label="공정 수정"
          onClick={() => setOpenUpdateConverting(true)}
          disabled={!only}
        />
        <Toolbar.ButtonPreset.Delete
          label="공정 삭제"
          onClick={cmdDelete}
          disabled={!only}
        />
      </Toolbar.Container>
      <div className="flex-1">
        <Table.Default
          data={taskData.data}
          page={page}
          setPage={setPage}
          columns={[
            {
              title: "공정 번호",
              dataIndex: "taskNo",
              render: (value) => <div className="font-fixed">{value}</div>,
            },
            {
              title: "공정 구분",
              dataIndex: "type",
              render: (value) => (
                <div className="font-fixed">{Util.taskTypeToString(value)}</div>
              ),
            },
            {
              title: "공정 지폭",
              render: (_value, record) => (
                <div className="font-fixed">
                  {(record.taskConverting ?? record.taskGuillotine)?.sizeX}
                </div>
              ),
            },
            {
              title: "공정 지장",
              render: (_value, record) => (
                <div className="font-fixed">
                  {(record.taskConverting ?? record.taskGuillotine)?.sizeY}
                </div>
              ),
            },
            {
              title: "작업 비고",
              render: (_value, record) => (
                <div className="font-fixed">
                  {(record.taskConverting ?? record.taskGuillotine)?.memo}
                </div>
              ),
            },
          ]}
          keySelector={(item) => item.id}
          selection="single"
          selected={selected}
          onSelectedChange={setSelected}
        />
      </div>
      <Popup.Plan.CreateTask
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        planId={props.plan.id}
      />
      {only && (
        <>
          <Popup.Plan.UpdateTaskConverting
            open={openUpdateConverting}
            onClose={() => setOpenUpdateConverting(false)}
            taskId={only.id}
          />
          <Popup.Plan.UpdateTaskGuillotine
            open={openUpdateGuillotine}
            onClose={() => setOpenUpdateGuillotine(false)}
            taskId={only.id}
          />
        </>
      )}
    </div>
  );
}

interface OutputProps {
  plan: Protocol.Record.Plan;
}
function Output(props: OutputProps) {
  const [openCreate, setOpenCreate] = useState(false);

  const [taskData, page, setPage] = Api.Internal.Plan.useGetOutputList(
    props.plan.id,
    {}
  );

  const [selected, setSelected] = useState<Record.StockEvent[]>([]);

  return (
    <div className="flex-1 flex flex-col p-4 gap-y-4">
      <div className="flex-1">
        <Table.Default
          data={taskData.data}
          page={page}
          setPage={setPage}
          columns={[
            {
              title: "포장",
              dataIndex: ["stock", "packaging", "type"],
              render: (value, record) => (
                <div className="font-fixed flex gap-x-1">
                  <div className="flex-initial flex flex-col justify-center text-lg">
                    <Icon.PackagingType
                      packagingType={record.stock.packaging.type}
                    />
                  </div>
                  <div className="flex-initial flex flex-col justify-center">
                    {value}
                  </div>
                </div>
              ),
            },
            {
              title: "수량",
              dataIndex: ["stock", "cachedQuantityAvailable"],
              render: (value, record) => (
                <div className="font-fixed text-right whitespace-pre">
                  {record.stock.packaging.type === "ROLL"
                    ? `${Util.comma(Util.gramsToTon(value ?? 0), 3)} t `
                    : `${value} 매`}
                </div>
              ),
            },
            {
              title: "제품유형",
              dataIndex: ["stock", "product", "paperDomain", "name"],
            },
            {
              title: "제지사",
              dataIndex: ["stock", "product", "manufacturer", "name"],
            },
            {
              title: "지군",
              dataIndex: ["stock", "product", "paperGroup", "name"],
            },
            {
              title: "지종",
              dataIndex: ["stock", "product", "paperType", "name"],
            },
            {
              title: "색군",
              dataIndex: ["stock", "paperColorGroup", "name"],
            },
            {
              title: "색상",
              dataIndex: ["stock", "paperColor", "name"],
            },
            {
              title: "무늬",
              dataIndex: ["stock", "paperPattern", "name"],
            },
            {
              title: "인증",
              dataIndex: ["stock", "paperCert", "name"],
            },
          ]}
          keySelector={(item) => item.id}
          selection="none"
          selected={selected}
          onSelectedChange={setSelected}
        />
      </div>
      <Popup.Plan.CreateOutput
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        planId={props.plan.id}
      />
    </div>
  );
}
