import { Api } from "@/@shared";
import { Button, FormControl } from "@/components";
import { Form, FormInstance, Input } from "antd";

interface Props {
  form: FormInstance<Api.PaidByCashCreateRequest | Api.PaidByEtcCreateRequest>;
  onFinish: (values: Api.PaidByCashCreateRequest | Api.PaidByEtcCreateRequest) => void;
}

export default function Component(props: Props) {
  return (
    <Form form={props.form} onFinish={props.onFinish} layout="vertical">
      <Form.Item name="partnerId" label="거래처 등록" rules={[{ required: true }]}>
        <FormControl.SelectPartner />
      </Form.Item>
      <Form.Item name="accountedDate" label="지급일">
        <FormControl.DatePicker />
      </Form.Item>
      <Form.Item name="amount" label="지급 금액">
        <Input type="number" />
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
      <Form.Item className="flex justify-end">
        <Button.Preset.Submit label="지급 추가" />
      </Form.Item>
    </Form>
  );
}

