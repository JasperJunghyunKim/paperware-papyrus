import { Api, Util } from "@/common";
import { Record } from "@/common/protocol";
import { Icon, Popup, StatBar, Table, Toolbar } from "@/components";
import { Page } from "@/components/layout";
import { useState } from "react";
import { TbPackages, TbTransitionBottom, TbWeight } from "react-icons/tb";

export default function Component() {
  const [openCreate, setOpenCreate] = useState(false);
  const [openUpdate, setOpenUpdate] = useState<number | false>(false);

  const stats = Api.Internal.Stock.useGetStockStats();
  const [data, page, setPage] = Api.Internal.Stock.useGetStockList({});
  const [selected, setSelected] = useState<Record.Stock[]>([]);

  return (
    <Page title="자사 재고 관리">
      <StatBar.Container>
        <StatBar.Item
          icon={<TbWeight />}
          label="내부 보관 재고"
          value={`${Util.comma(stats.data?.stockCount)}`}
        />
        <StatBar.Item
          icon={<TbPackages />}
          label="외부 보관 재고"
          value={`${Util.comma(stats.data?.exstoreStockCount)}`}
        />
        <StatBar.Item
          icon={<TbTransitionBottom />}
          label="도착 예정 목록"
          value={`${Util.comma(0)}`}
          iconClassName="text-purple-800"
        />
      </StatBar.Container>
      <Toolbar.Container>
        <Toolbar.ButtonPreset.Create
          label="재고 추가"
          onClick={() => setOpenCreate(true)}
        />
        <div className="flex-1" />
      </Toolbar.Container>
      <Table.Default<Record.Stock>
        data={data.data}
        page={page}
        setPage={setPage}
        keySelector={(record) => record.id}
        selected={selected}
        onSelectedChange={setSelected}
        columns={[
          {
            title: "재고 번호",
            dataIndex: "serial",
            render: (value) => <div className="font-fixed">{value}</div>,
          },
          {
            title: "창고",
            dataIndex: ["warehouse", "name"],
          },
          {
            title: "포장",
            dataIndex: ["packaging", "type"],
            render: (value, record) => (
              <div className="font-fixed flex gap-x-1">
                <div className="flex-initial flex flex-col justify-center text-lg">
                  <Icon.PackagingType packagingType={record.packaging.type} />
                </div>
                <div className="flex-initial flex flex-col justify-center">
                  {value}
                </div>
              </div>
            ),
          },
          {
            title: "단가",
            dataIndex: ["price"],
            render: (value, record) => (
              <div className="font-fixed text-right whitespace-pre">
                {`${Util.comma(value)} ${Util.formatPriceUnit(
                  record.packaging.type
                ).padEnd(5)}`}
              </div>
            ),
          },
          {
            title: "실물 수량",
            dataIndex: ["cachedQuantity"],
            render: (value, record) => (
              <div className="font-fixed text-right whitespace-pre">
                {record.packaging.type === "ROLL"
                  ? `${Util.comma(Util.gramsToTon(value ?? 0), 3)} t `
                  : `${value} 매`}
              </div>
            ),
          },
          {
            title: "가용 수량",
            dataIndex: ["cachedQuantity"],
            render: (value, record) => (
              <div className="font-fixed text-right whitespace-pre">
                {record.packaging.type === "ROLL"
                  ? `${Util.comma(Util.gramsToTon(value ?? 0), 3)} t `
                  : `${value} 매`}
              </div>
            ),
          },
          {
            title: "제품유형",
            dataIndex: ["product", "paperDomain", "name"],
          },
          {
            title: "제지사",
            dataIndex: ["product", "manufacturer", "name"],
          },
          {
            title: "지군",
            dataIndex: ["product", "paperGroup", "name"],
          },
          {
            title: "지종",
            dataIndex: ["product", "paperType", "name"],
          },
          {
            title: "색군",
            dataIndex: ["paperColorGroup", "name"],
          },
          {
            title: "색상",
            dataIndex: ["paperColor", "name"],
          },
          {
            title: "무늬",
            dataIndex: ["paperPattern", "name"],
          },
          {
            title: "인증",
            dataIndex: ["paperCert", "name"],
          },
        ]}
      />
      <Popup.Stock.Create open={openCreate} onClose={setOpenCreate} />
      <Popup.Stock.Update open={openUpdate} onClose={setOpenUpdate} />
    </Page>
  );
}
