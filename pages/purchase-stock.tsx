import { Api, Util } from "@/common";
import { Record } from "@/common/protocol";
import { Icon, Popup, Table } from "@/components";
import { Page } from "@/components/layout";
import { useState } from "react";

export default function Component() {
  const [openCreate, setOpenCreate] = useState(false);
  const [openUpdate, setOpenUpdate] = useState<number | false>(false);

  const [data, page, setPage] = Api.External.VendorStock.useGetStockList({});
  const [selected, setSelected] = useState<Record.VendorStock[]>([]);

  return (
    <Page title="매입처 재고 조회">
      <Table.Default<Record.VendorStock>
        data={data.data}
        page={page}
        setPage={setPage}
        keySelector={(record) => record.id}
        selected={selected}
        onSelectedChange={setSelected}
        columns={[
          {
            title: "매입처",
            dataIndex: ["company", "businessName"],
          },
          {
            title: "창고",
            dataIndex: ["warehouse", "name"],
          },
          {
            title: "주소",
            dataIndex: ["warehouse", "address"],
            render: (value) => <div>{Util.formatAddress(value)}</div>,
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
