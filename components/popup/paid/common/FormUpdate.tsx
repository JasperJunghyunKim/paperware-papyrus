import { Api } from "@/@shared";
import { Button, FormControl } from "@/components";
import { Form, FormInstance, Input } from "antd";

interface Props {
  form: FormInstance<Api.PaidByCashUpdateRequest | Api.PaidByEtcUpdateRequest>;
  onFinish: (values: Api.PaidByCashUpdateRequest | Api.PaidByEtcUpdateRequest) => void;
  edit: boolean;
  onEditChange: (edit: boolean) => void;
}

export default function Component(props: Props) {
  return (
    <Form
      form={props.form}
      onFinish={(values) => {
        props.onFinish(values);
      }}
      layout="vertical"
      disabled={!props.edit}
      rootClassName="flex flex-col gap-y-4"
    >
      <div className="flex flex-row justify-end gap-x-2">
        <Button.Preset.Edit
          label="내용 수정"
          onClick={() => props.onEditChange(true)}
          hidden={props.edit}
        />
        <Button.Default
          label="수정 취소"
          onClick={() => props.onEditChange(false)}
          hidden={!props.edit}
        />
        <Button.Preset.Submit label="내용 저장" hidden={!props.edit} />
      </div>

      <div className="h-px bg-gray-200" />

      <Form.Item name="partnerNickName" label="거래처">
        <Input disabled />
      </Form.Item>
      <Form.Item name="accountedDate" label="지급일">
        <FormControl.DatePicker />
      </Form.Item>
      <Form.Item name="amount" label="지급 금액">
        <Input />
      </Form.Item>
      <Form.Item name="accountedSubject" label="계정 과목">
        <FormControl.SelectPaidSubject />
      </Form.Item>
      <Form.Item name="accountedMethod" label="지급 수단">
        <FormControl.SelectMethod />
      </Form.Item>
      <Form.Item name="memo" label="비고">
        <Input />
      </Form.Item>
    </Form>
  );
}
