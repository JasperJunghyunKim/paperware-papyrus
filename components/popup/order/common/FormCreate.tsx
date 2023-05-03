import { Api } from "@/common";
import { Button, FormControl } from "@/components";
import { Form, FormInstance, Input } from "antd";
import { useWatch } from "antd/lib/form/Form";

type RecordType = Api.External.Order.CreateOrder;

interface Props {
  form: FormInstance<RecordType>;
  onFinish: (values: RecordType) => void;
}

export default function Component(props: Props) {
  return (
    <Form form={props.form} onFinish={props.onFinish} layout="vertical">
      <Form.Item
        name="dstCompanyId"
        label="매입처"
        rules={[{ required: true }]}
      >
        <FormControl.SelectCompanyPurchase />
      </Form.Item>
      <Form.Item name="wantedDate" label="마감 희망일">
        <FormControl.DatePicker />
      </Form.Item>
      <Form.Item name="memo" label="기타 요청사항">
        <Input.TextArea maxLength={200} />
      </Form.Item>
      <Form.Item className="flex justify-end">
        <Button.Preset.Submit label="주문 등록" />
      </Form.Item>
    </Form>
  );
}
