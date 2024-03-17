import { Model } from "@/@shared";
import { ApiHook, Util } from "@/common";
import { usePage } from "@/common/hook";
import { Icon, Popup, StatBar, Table, Toolbar } from "@/components";
import { Page } from "@/components/layout";
import { useCallback, useState } from "react";
import { TbMapPin, TbMapPinFilled } from "react-icons/tb";

export default function Component() {
  const [page, setPage] = usePage();
  const list = ApiHook.Stock.StockArrival.useGetList({
    query: page,
  });
  const [selected, setSelected] = useState<Model.StockEvent[]>([]);
  const only = Util.only(selected);

  const apiApply = ApiHook.Stock.StockArrival.useApply();
  const cmdApply = useCallback(async () => {
    if (!only) return;
    if (!(await Util.confirm("선택한 재고를 입고하시겠습니까?"))) {
      return;
    }

    await apiApply.mutateAsync({
      stockEventId: only.id,
    });

    setSelected([]);
  }, [apiApply, only]);

  return (
    <Page title="도착 예정 목록">
      <StatBar.Container>
        <StatBar.Item
          icon={<TbMapPinFilled />}
          label="도착 예정 재고"
          value={"-"}
        />
      </StatBar.Container>
      <Toolbar.Container>
        <div className="flex-1" />
        <Toolbar.ButtonPreset.Continue
          label="재고 입고"
          disabled={!only}
          onClick={cmdApply}
        />
      </Toolbar.Container>
      <Table.Default<Model.StockEvent>
        data={list.data}
        page={page}
        setPage={setPage}
        keySelector={(record) => `${record.id}`}
        selected={selected}
        onSelectedChange={setSelected}
        selection="single"
        columns={[
          {
            title: "#",
            dataIndex: "id",
            render: (value) => (
              <div className="text-right font-fixed">{`${Util.comma(
                value
              )}`}</div>
            ),
          },
          ...Table.Preset.columnStockGroup<Model.StockEvent>(
            (p) => p.stock,
            ["stock"]
          ),
          ...Table.Preset.columnQuantity<Model.StockEvent>(
            (record) => record.stock,
            ["change"],
            { prefix: "실물" }
          ),
        ]}
      />
    </Page>
  );
}
