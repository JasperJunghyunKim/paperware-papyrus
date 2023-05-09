import { Model } from "@/@shared";
import { ApiHook, Util } from "@/common";
import { usePage } from "@/common/hook";
import { Condition, Popup, Table } from "@/components";
import { Page } from "@/components/layout";
import { useState } from "react";

export default function Component() {
  const [openCreate, setOpenCreate] = useState(false);

  const [page, setPage] = usePage();
  const list = ApiHook.Partner.useGetPaidList({ query: page });
  const [selectedPaid, setSelectedPaid] = useState<Model.Accounted[]>([]);

  return (
    <Page title="지급 내역 조회">
      <Condition.Container>
        <Condition.Item />
      </Condition.Container>
      <Table.Default<Model.Accounted>
        data={list.data}
        page={page}
        setPage={setPage}
        keySelector={(record) => {
          console.log(record);
          return ''
        }}
        selected={selectedPaid}
        onSelectedChange={setSelectedPaid}
        selection="single"
        columns={[
          {
            title: "거래처",
            dataIndex: ["warehouse", "name"],
          },
          {
            title: "수금일",
            dataIndex: ["product", "paperDomain", "name"],
          },
          {
            title: "수금 금액",
            dataIndex: ["product", "manufacturer", "name"],
            render: (value) => (
              <div className="text-right font-fixed">{`${Util.comma(value)} ${Util.UNIT_GPM
                }`}</div>
            ),
          },
          {
            title: "계정과목",
            dataIndex: ["product", "paperGroup", "name"],
          },
          {
            title: "수금 수단",
            dataIndex: ["product", "paperType", "name"],
          },
          {
            title: "계정",
            dataIndex: "grammage",
          },
        ]}
      />
      <Popup.Stock.Create open={openCreate} onClose={setOpenCreate} />
    </Page>
  );
}
