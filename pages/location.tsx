import { Api, Util } from "@/common";
import { Record } from "@/common/protocol";
import { Popup, StatBar, Table, Toolbar } from "@/components";
import { Page } from "@/components/layout";
import { useCallback, useState } from "react";
import { TbHome, TbHomeShield, TbMapPin, TbMapPinFilled } from "react-icons/tb";

export default function Component() {
  const [openCreate, setOpenCreate] = useState(false);
  const [openUpdate, setOpenUpdate] = useState<number | false>(false);

  const stats = Api.Internal.Location.useGetLocationStats();
  const [data, page, setPage] = Api.Internal.Location.useGetLocationList({});
  const [selected, setSelected] = useState<Record.Location[]>([]);

  const only = Util.only(selected);

  const apiDelete = Api.Internal.Location.useDeleteLocation();
  const cmdDelete = useCallback(async () => {
    if (
      !only ||
      !(await Util.confirm(`선택한 도착지(${only.name})를 삭제하시겠습니까?`))
    ) {
      return;
    }

    await apiDelete.mutateAsync(only.id);
  }, [apiDelete, only]);

  return (
    <Page title="도착지 설정">
      <StatBar.Container>
        <StatBar.Item
          icon={<TbMapPinFilled />}
          label="공개 도착지"
          value={Util.comma(stats.data?.publicCount ?? 0)}
        />
        <StatBar.Item
          icon={<TbMapPin />}
          label="비공개 도착지"
          value={Util.comma(stats.data?.privateCount ?? 0)}
          iconClassName="text-purple-800"
        />
      </StatBar.Container>
      <Toolbar.Container>
        <Toolbar.ButtonPreset.Create
          label="도착지 추가"
          onClick={() => setOpenCreate(true)}
        />
        <div className="flex-1" />
        {only && (
          <Toolbar.ButtonPreset.Update
            label="선택 도착지 상세"
            onClick={() => setOpenUpdate(only.id)}
          />
        )}
        {only && (
          <Toolbar.ButtonPreset.Delete
            label="선택 도착지 삭제"
            onClick={async () => await cmdDelete()}
          />
        )}
      </Toolbar.Container>
      <Table.Default<Record.Location>
        data={data.data}
        page={page}
        setPage={setPage}
        keySelector={(record) => record.id}
        selected={selected}
        onSelectedChange={setSelected}
        columns={[
          {
            title: "도착지 이름",
            dataIndex: "name",
          },
          {
            title: "도착지 코드",
            dataIndex: "code",
            render: (value) => <div className="font-fixed">{value}</div>,
          },
          {
            title: "공개 여부",
            dataIndex: "isPublic",
            render: (value) => (value ? "공개" : "비공개"),
          },
          {
            title: "주소",
            dataIndex: "address",
            render: (value) => <div>{Util.formatAddress(value)}</div>,
          },
        ]}
      />
      <Popup.Location.Create open={openCreate} onClose={setOpenCreate} />
      <Popup.Location.Update open={openUpdate} onClose={setOpenUpdate} />
    </Page>
  );
}
