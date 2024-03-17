import { Model } from "@/@shared";
import { ApiHook, Util } from "@/common";
import { usePage } from "@/common/hook";
import { Icon, Popup, StatBar, Table, Toolbar } from "@/components";
import { Page } from "@/components/layout";
import classNames from "classnames";
import { useCallback, useState } from "react";
import { TbHome, TbHomeShield } from "react-icons/tb";

export default function Component() {
  const [openCreate, setOpenCreate] = useState(false);
  const [openUpdate, setOpenUpdate] = useState<number | false>(false);

  const [page, setPage] = usePage();
  const list = ApiHook.Working.Plan.useGetList({ query: page });
  const [selected, setSelected] = useState<Model.Plan[]>([]);

  const only = Util.only(selected);

  const apiDelete = ApiHook.Inhouse.Warehouse.useDelete();
  const cmdDelete = useCallback(async () => {
    if (
      !only ||
      !(await Util.confirm(
        `선택한 작업 계획(${only.planNo})를 삭제하시겠습니까?`
      ))
    ) {
      return;
    }

    await apiDelete.mutateAsync(only.id);
  }, [apiDelete, only]);

  return (
    <Page title="작업 계획 목록">
      <StatBar.Container>
        <StatBar.Item icon={<TbHome />} label="작업 계획" value={"-"} />
        <StatBar.Item
          icon={<TbHomeShield />}
          label="작업 계획"
          value={"-"}
          iconClassName="text-purple-800"
        />
      </StatBar.Container>
      <Toolbar.Container>
        <Toolbar.ButtonPreset.Create
          label="작업 계획 추가"
          onClick={() => setOpenCreate(true)}
        />
        <div className="flex-1" />
        {only && (
          <Toolbar.ButtonPreset.Update
            label="선택 작업 계획 상세"
            onClick={() => setOpenUpdate(only.id)}
          />
        )}
      </Toolbar.Container>
      <Table.Default<Model.Plan>
        data={list.data}
        page={page}
        setPage={setPage}
        keySelector={(record) => record.id}
        selected={selected}
        onSelectedChange={setSelected}
        columns={[
          {
            title: "작업 계획 번호",
            dataIndex: "planNo",
            render: (value) => (
              <div className="flex">
                <div className="font-fixed bg-green-100 px-1 text-green-800 rounded-md">
                  {value}
                </div>
              </div>
            ),
          },
          {
            title: "주문 번호",
            dataIndex: ["orderStock", "order", "orderNo"],
            render: (value, record) => (
              <div className="flex">
                <div className="font-fixed bg-sky-100 px-1 text-sky-800 rounded-md">
                  {value}
                </div>
              </div>
            ),
          },
          {
            title: "상태",
            dataIndex: "status",
            render: (value: Model.Enum.PlanStatus) => (
              <div
                className={classNames("flex gap-x-2", {
                  "text-amber-600": value === "PREPARING",
                  "text-green-600": value === "PROGRESSING",
                  "text-black": value === "PROGRESSED",
                })}
              >
                <div className="flex-initial flex flex-col justify-center">
                  <Icon.PlanStatus value={value} />
                </div>
                <div className="flex-initial flex flex-col justify-center">
                  {Util.planStatusToString(value)}
                </div>
              </div>
            ),
          },
          {
            title: "원지 창고",
            dataIndex: [
              "targetStockGroupEvent",
              "stockGroup",
              "warehouse",
              "name",
            ],
          },
          ...Table.Preset.columnStockGroup<Model.Plan>(
            (record) => record.targetStockGroupEvent.stockGroup,
            ["targetStockGroupEvent", "stockGroup"]
          ),
          ...Table.Preset.columnQuantity<Model.Plan>(
            (record) => record.targetStockGroupEvent.stockGroup,
            ["targetStockGroupEvent", "change"],
            { prefix: "원지" }
          ),
        ]}
      />
      <Popup.Plan.Create open={openCreate} onClose={setOpenCreate} />
      <Popup.Plan.Update open={openUpdate} onClose={setOpenUpdate} />
    </Page>
  );
}
