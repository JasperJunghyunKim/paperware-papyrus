import { Api } from "@/@shared";
import { AccountedType } from "@/@shared/models/enum";
import { Button, FormControl } from "@/components";
import { Form, FormInstance, Input } from "antd";

interface Props {
  accountedType: AccountedType;
  form: FormInstance<Api.ByCashCreateRequest | Api.ByEtcCreateRequest>;
  onFinish: (values: Api.ByCashCreateRequest | Api.ByEtcCreateRequest) => void;
}

export default function Component(props: Props) {
  return (
    <Form form={props.form} onFinish={props.onFinish} layout="vertical">
      <Form.Item name="partnerId" label="거래처 등록" rules={[{ required: true }]}>
        <FormControl.SelectPartner />
      </Form.Item>
      <Form.Item name="accountedDate" label={`${props.accountedType === 'PAID' ? '지급' : '수금'}일`}>
        <FormControl.DatePicker />
      </Form.Item>
      <Form.Item name="amount" label={`${props.accountedType === 'PAID' ? '지급' : '수금'} 금액`}>
        <Input type="number" />
      </Form.Item>
      <Form.Item name="accountedSubject" label="계정 과목">
        <FormControl.SelectSubject accountedType={props.accountedType} />
      </Form.Item>
      <Form.Item name="accountedMethod" label={`${props.accountedType === 'PAID' ? '지급' : '수금'} 수단`}>
        <FormControl.SelectMethod />
      </Form.Item>
      <Form.Item name="memo" label="비고">
        <Input />
      </Form.Item>
      <Form.Item className="flex justify-end">
        <Button.Preset.Submit label={`${props.accountedType === 'PAID' ? '지급' : '수금'} 추가`} />
      </Form.Item>
    </Form>
  );
}

