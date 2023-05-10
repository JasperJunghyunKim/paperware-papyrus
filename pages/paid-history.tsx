import { Model } from "@/@shared";
import { Enum } from "@/@shared/models";
import { ApiHook, Util } from "@/common";
import { usePage } from "@/common/hook";
import { Condition, Popup, Table, Toolbar } from "@/components";
import { Page } from "@/components/layout";
import { useCallback, useState } from "react";

export default function Component() {
  const [openCreate, setOpenCreate] = useState(false);
  const [openUpdate, setOpenUpdate] = useState<number | false>(false);

  const [page, setPage] = usePage();
  const list = ApiHook.Partner.Accounted.useGetPaidList({
    query: {
      ...page,
      partnerId: 0,
      accountedSubject: 'All',
      accountedMethod: 'All',
      accountedFromDate: '2020-01-01',
      accountedToDate: '2023-05-10'
    }
  });
  const [selectedPaid, setSelectedPaid] = useState<Model.Accounted[]>([]);

  const only = Util.only(selectedPaid);

  const apiByCashDelete = ApiHook.Partner.ByCash.useByCashPaidDelete();
  const apiByEtcDelete = ApiHook.Partner.ByEtc.useByEtcPaidDelete();
  const cmdDelete = useCallback(async () => {
    if (
      !only ||
      !(await Util.confirm(`해당 거래를(${only.partnerNickName})를 삭제하시겠습니까?`))
    ) {
      return;
    }

    const method: Enum.Method = only.accountedMethod;

    switch (method) {
      case 'ACCOUNT_TRANSFER':
      // TODO
      case 'CARD_PAYMENT':
      // TODO
      case 'PROMISSORY_NOTE':
      // TODO
      case 'SET_OFF':
      // TODO
      case 'CASH':
        await apiByCashDelete.mutateAsync(only.id);
      case 'ETC':
        await apiByEtcDelete.mutateAsync(only.id);
    }

  }, [apiByCashDelete, apiByEtcDelete, only]);

  return (
    <Page title="지급 내역 조회">
      <Condition.Container>
        <Condition.Item />
      </Condition.Container>
      <Toolbar.Container>
        <Toolbar.ButtonPreset.Create
          label="지급 내역 추가"
          onClick={() => setOpenCreate(true)}
        />
        <div className="flex-1" />
        {only && (
          <Toolbar.ButtonPreset.Update
            label="지급 내역 상세"
            onClick={() => setOpenUpdate(only.id)}
          />
        )}
        {only && (
          <Toolbar.ButtonPreset.Delete
            label="지급 내역 삭제"
            onClick={async () => await cmdDelete()}
          />
        )}
      </Toolbar.Container>
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
            dataIndex: ["partnerNickName"],
          },
          {
            title: "수금일",
            dataIndex: ["accountedDate"],
          },
          {
            title: "수금 금액",
            dataIndex: ["amount"],
            render: (value) => (
              <div className="text-right font-fixed">{`${Util.comma(value)}`}</div>
            ),
          },
          {
            title: "계정 과목",
            dataIndex: ["accountedSubject"],
          },
          {
            title: "수금 수단",
            dataIndex: ["accountedSubject"],
          },
          {
            title: "계정",
            dataIndex: "gubun",
          },
        ]}
      />
      <Popup.Paid.Create open={openCreate} onClose={setOpenCreate} />
      <Popup.Paid.Update open={openUpdate} onClose={setOpenUpdate} />
    </Page>
  );
}
