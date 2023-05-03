import { Api, Util } from "@/common";
import { Record } from "@/common/protocol";
import { Popup, StatBar, Table, Toolbar } from "@/components";
import { Page } from "@/components/layout";
import { useState } from "react";
import { TbHome } from "react-icons/tb";

export default function Component() {
  const [openCreate, setOpenCreate] = useState(false);
  const [openUpdate, setOpenUpdate] = useState<number | false>(false);

  const stats = Api.Internal.Plan.useGetStats();
  const [data, page, setPage] = Api.Internal.Plan.useGetList({});
  const [selected, setSelected] = useState<Record.Plan[]>([]);

  const only = Util.only(selected);

  return (
    <Page title="작업 계획 설정">
      <StatBar.Container>
        <StatBar.Item
          icon={<TbHome />}
          label="작업 계획"
          value={Util.comma(stats.data?.publicCount ?? 0)}
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
            label="선택 계획 상세"
            onClick={() => setOpenUpdate(only.id)}
          />
        )}
      </Toolbar.Container>
      <Table.Default<Record.Plan>
        data={data.data}
        page={page}
        setPage={setPage}
        keySelector={(record) => record.id}
        selected={selected}
        onSelectedChange={setSelected}
        columns={[
          {
            title: "작업 계획 번호",
            dataIndex: "planNo",
            render: (value) => <div className="font-fixed">{value}</div>,
          },
          {
            title: "생성일",
            dataIndex: "createdAt",
            render: (value) => (
              <div className="font-fixed">
                {Util.formatIso8601ToLocalDate(value)}
              </div>
            ),
          },
        ]}
      />
      <Popup.Plan.Update open={openUpdate} onClose={setOpenUpdate} />
    </Page>
  );
}
