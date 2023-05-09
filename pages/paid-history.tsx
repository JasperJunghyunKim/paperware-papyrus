import { Model } from "@/@shared";
import { ApiHook, Util } from "@/common";
import { usePage } from "@/common/hook";
import { Condition, Popup, Table } from "@/components";
import { Page } from "@/components/layout";
import { useState } from "react";

export default function Component() {
  const [openCreate, setOpenCreate] = useState(false);

  const [page, setPage] = usePage();
  const list = ApiHook.Stock.StockInhouse.useGetGroupList({ query: page });
  const [selectedGroup, setSelectedGroup] = useState<Model.StockGroup[]>([]);

  return (
    <Page title="지급 내역 조회">
      <Condition.Container>
        <Condition.Item />
      </Condition.Container>
      <Table.Default<Model.StockGroup>
        data={list.data}
        page={page}
        setPage={setPage}
        keySelector={(record) =>
          `${record.product.id} ${record.sizeX} ${record.sizeY} ${record.grammage
          } ${record.paperColorGroup?.id ?? "_"} ${record.paperColor?.id ?? "_"
          } ${record.paperPattern?.id ?? "_"} ${record.paperCert?.id ?? "_"} ${record.warehouse?.id ?? "_"
          }`
        }
        selected={selectedGroup}
        onSelectedChange={setSelectedGroup}
        selection="single"
        columns={[
          {
            title: "창고",
            dataIndex: ["warehouse", "name"],
          },
          {
            title: "제품 유형",
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
            title: "평량",
            dataIndex: "grammage",
            render: (value) => (
              <div className="text-right font-fixed">{`${Util.comma(value)} ${Util.UNIT_GPM
                }`}</div>
            ),
          },
          {
            title: "지폭",
            dataIndex: "sizeX",
            render: (value) => (
              <div className="text-right font-fixed">{`${Util.comma(
                value
              )} mm`}</div>
            ),
          },
          {
            title: "지장",
            dataIndex: "sizeY",
            render: (value, record) =>
              record.packaging.type !== "ROLL" ? (
                <div className="text-right font-fixed">{`${Util.comma(
                  value
                )} mm`}</div>
              ) : null,
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
          {
            title: "실물 수량",
            dataIndex: "totalQuantity",
            render: (value) => (
              <div className="text-right font-fixed">{`${Util.comma(
                value
              )}`}</div>
            ),
          },
          {
            title: "가용 수량",
            dataIndex: "availableQuantity",
            render: (value) => (
              <div className="text-right font-fixed">{`${Util.comma(
                value
              )}`}</div>
            ),
          },
        ]}
      />
      <Popup.Stock.Create open={openCreate} onClose={setOpenCreate} />
    </Page>
  );
}
