import { Api } from "@/@shared";
import { Button, FormControl } from "@/components";
import { Form, FormInstance, Input } from "antd";

interface Props {
  form: FormInstance<Api.CollectedByCashCreateRequest | Api.CollectedByEtcCreateRequest>;
  onFinish: (values: Api.CollectedByCashCreateRequest | Api.CollectedByEtcCreateRequest) => void;
}

export default function Component(props: Props) {
  return (
    <Form form={props.form} onFinish={props.onFinish} layout="vertical">
      <Form.Item name="partnerId" label="거래처 등록" rules={[{ required: true }]}>
        <FormControl.SelectPartner />
      </Form.Item>
      <Form.Item name="accountedDate" label="수금일">
        <FormControl.DatePicker />
      </Form.Item>
      <Form.Item name="amount" label="수금 금액">
        <Input type="number" />
      </Form.Item>
      <Form.Item name="accountedSubject" label="계정 과목">
        <FormControl.SelectCollectedSubject />
      </Form.Item>
      <Form.Item name="accountedMethod" label="수금 수단">
        <FormControl.SelectMethod />
      </Form.Item>
      <Form.Item name="memo" label="비고">
        <Input />
      </Form.Item>
      <Form.Item className="flex justify-end">
        <Button.Preset.Submit label="수금 추가" />
      </Form.Item>
    </Form>
  );
}

