import { Api, Util } from "@/common";
import { Record } from "@/common/protocol";
import { Popup, Table, Toolbar } from "@/components";
import { Page } from "@/components/layout";
import { useCallback, useState } from "react";

export default function Component() {
  const [openUpdate, setOpenUpdate] = useState<number | false>(false);

  const [data, page, setPage] = Api.Internal.Shipping.useGetList({});
  const [selected, setSelected] = useState<Record.Shipping[]>([]);

  const only = Util.only(selected);

  const apiCreate = Api.Internal.Shipping.useCreateItem();
  const cmdCreate = useCallback(async () => {
    if (!(await Util.confirm("배송을 추가하시겠습니까?"))) {
      return;
    }

    await apiCreate.mutateAsync({ data: {} });
  }, [apiCreate]);

  const apiDelete = Api.Internal.Shipping.useDeleteItem();
  const cmdDelete = useCallback(async () => {
    if (
      !only ||
      !(await Util.confirm(
        `선택한 배송(${only.shippingNo})를 삭제하시겠습니까?`
      ))
    ) {
      return;
    }

    await apiDelete.mutateAsync(only.id);
  }, [apiDelete, only]);

  return (
    <Page title="배송 설정">
      <Toolbar.Container>
        <Toolbar.ButtonPreset.Create label="배송 추가" onClick={cmdCreate} />
        <div className="flex-1" />
        {only && (
          <Toolbar.ButtonPreset.Update
            label="선택 배송 상세"
            onClick={() => setOpenUpdate(only.id)}
          />
        )}
        {only && (
          <Toolbar.ButtonPreset.Delete
            label="선택 배송 삭제"
            onClick={async () => await cmdDelete()}
          />
        )}
      </Toolbar.Container>
      <Table.Default<Record.Shipping>
        data={data.data}
        page={page}
        setPage={setPage}
        keySelector={(record) => record.id}
        selected={selected}
        onSelectedChange={setSelected}
        columns={[
          {
            title: "배송 이름",
            dataIndex: "name",
          },
          {
            title: "배송 번호",
            dataIndex: "shippingNo",
            render: (value) => <div className="font-fixed">{value}</div>,
          },
        ]}
      />
      <Popup.Shipping.Update open={openUpdate} onClose={setOpenUpdate} />
    </Page>
  );
}
