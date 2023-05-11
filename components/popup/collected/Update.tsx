import { ApiHook } from "@/common";
import { Popup } from "@/components";
import { useForm } from "antd/lib/form/Form";
import { useCallback, useEffect, useState } from "react";
import FormUpdate from "./common/FormUpdate";
import { Api } from "@/@shared";
import { Enum } from "@/@shared/models";

export interface Props {
  method: Enum.Method | null;
  open: number | false;
  onClose: (unit: false) => void;
}

export default function Component(props: Props) {
  const [form] = useForm<Api.CollectedByCashUpdateRequest | Api.CollectedByEtcUpdateRequest>();
  const [edit, setEdit] = useState(false);

  const resByCash = ApiHook.Partner.ByCash.useGetByCashCollectedItem({ id: props.open, method: props.method });
  const resByEtc = ApiHook.Partner.ByEtc.useGetByEtcCollectedItem({ id: props.open, method: props.method });
  const apiByCash = ApiHook.Partner.ByCash.useByCashCollectedUpdate();
  const apiByEtc = ApiHook.Partner.ByEtc.useByEtcCollectedUpdate();

  const cmd = useCallback(
    async (values: Api.CollectedByCashUpdateRequest | Api.CollectedByEtcUpdateRequest) => {
      if (!props.open) {
        return;
      }
      values.partnerId = resByCash.data?.partnerId ?? 0;
      values.partnerNickName = '';

      switch (props.method) {
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
            id: resByCash.data?.accountedId ?? 0
          });
          break;
        case 'ETC':
          await apiByEtc.mutateAsync({
            data: values,
            id: resByCash.data?.accountedId ?? 0
          });
          break;
      }

      await apiByCash.mutateAsync({ id: props.open, data: values });
      setEdit(false);
    },
    [apiByCash, apiByEtc, props.open, props.method, resByCash]
  );

  useEffect(() => {
    switch (props.method) {
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
        form.setFieldsValue({
          partnerNickName: resByCash.data?.partnerNickName,
          accountedDate: resByCash.data?.accountedDate,
          accountedMethod: resByCash.data?.accountedMethod,
          accountedSubject: resByCash.data?.accountedSubject,
          memo: resByCash.data?.memo,
          amount: resByCash.data?.amount,
        });
        break;
      case 'ETC':
        form.setFieldsValue({
          partnerNickName: resByEtc.data?.partnerNickName,
          accountedDate: resByEtc.data?.accountedDate,
          accountedMethod: resByEtc.data?.accountedMethod,
          accountedSubject: resByEtc.data?.accountedSubject,
          memo: resByEtc.data?.memo,
          amount: resByEtc.data?.amount,
        });
        break;
    }

  }, [props.method, form, resByCash, edit, resByEtc]);

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
