import { Api, Util } from "@/common";
import { Record } from "@/common/protocol";
import { Icon, Popup, StatBar, Table, Toolbar } from "@/components";
import { Page } from "@/components/layout";
import { useState } from "react";
import { TbTransferIn, TbTransitionBottom } from "react-icons/tb";

export default function Component() {
  const [openApply, setOpenApply] = useState(false);

  const [data, page, setPage] = Api.Internal.StockArrival.useGetStockList({});
  const [selected, setSelected] = useState<Record.StockEvent[]>([]);

  const only = Util.only(selected);

  return (
    <Page title="도착 예정 목록">
      <StatBar.Container>
        <StatBar.Item
          icon={<TbTransitionBottom />}
          label="도착 예정 목록"
          value={`${Util.comma(0)}`}
          iconClassName="text-purple-800"
        />
      </StatBar.Container>
      <Toolbar.Container>
        <div className="flex-1" />
        <Toolbar.Button
          type="primary"
          icon={<TbTransferIn />}
          label="입고 등록"
          disabled={!only}
          onClick={() => setOpenApply(true)}
        />
      </Toolbar.Container>
      <Table.Default<Record.StockEvent>
        data={data.data}
        page={page}
        setPage={setPage}
        keySelector={(record) => record.id}
        selected={selected}
        onSelectedChange={setSelected}
        columns={[
          {
            title: "재고 번호",
            dataIndex: ["stock", "serial"],
            render: (value) => <div className="font-fixed">{value}</div>,
          },
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
            title: "입고 수량",
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
      />
      {only && (
        <Popup.StockArrival.ApplyArrivedStock
          stockEventId={only.id}
          open={openApply}
          onClose={setOpenApply}
        />
      )}
    </Page>
  );
}
