import { ApiHook } from "@/common";
import { Popup } from "@/components";
import { useForm } from "antd/lib/form/Form";
import { useCallback, useEffect, useState } from "react";
import FormUpdate from "./common/FormUpdate";
import { Api } from "@/@shared";
import { Enum } from "@/@shared/models";

export interface Props {
  open: number | false;
  onClose: (unit: false) => void;
}




export default function Component(props: Props) {
  const [form] = useForm<Api.PaidByCashUpdateRequest | Api.PaidByEtcUpdateRequest>();
  const [edit, setEdit] = useState(false);

  const res = ApiHook.Partner.ByCash.useGetByCashPaidItem({ id: props.open });
  const apiByCash = ApiHook.Partner.ByCash.useByCashPaidUpdate();
  const apiByEtc = ApiHook.Partner.ByEtc.useByEtcPaidUpdate();
  const cmd = useCallback(
    async (values: Api.PaidByCashUpdateRequest | Api.PaidByEtcUpdateRequest) => {
      if (!props.open) {
        return;
      }

      const method: Enum.Method = form.getFieldValue("accountedMethod");

      switch (method) {
        case 'ACCOUNT_TRANSFER':
          // TODO
          break;
        case 'CARD_PAYMENT':
          // TODO
          break;
        case 'PROMISSORY_NOTE':
          // TODO
          break;
        case 'SET_OFF':
          // TODO
          break;
        case 'CASH':
          await apiByCash.mutateAsync({
            data: values,
            id: res?.data?.partnerId ?? 0
          });
          break;
        case 'ETC':
          await apiByEtc.mutateAsync({
            data: values,
            id: res?.data?.partnerId ?? 0
          });
          break;
      }

      await apiByCash.mutateAsync({ id: props.open, data: values });
      setEdit(false);
    },
    [apiByCash, apiByEtc, form, props.open, res]
  );


  useEffect(() => {
    if (!res.data || edit) {
      return;
    }

    form.setFieldsValue({
      partnerNickName: res.data.partnerNickName,
      accountedDate: res.data.accountedDate,
      accountedMethod: res.data.accountedMethod,
      accountedSubject: res.data.accountedSubject,
      memo: res.data.memo,
      amount: res.data.amount,
    });
  }, [form, res.data, edit]);
  return (
    <Popup.Template.Property title="도착지 상세" {...props} open={!!props.open}>
      <div className="flex-1 p-4">
        <FormUpdate
          form={form}
          edit={edit}
          onFinish={async (values) => await cmd(values)}
          onEditChange={(edit) => setEdit(edit)}
        />
      </div>
    </Popup.Template.Property>
  );
}
