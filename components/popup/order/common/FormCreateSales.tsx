import { Api } from "@/common";
import { Button, FormControl } from "@/components";
import { Form, FormInstance, Input } from "antd";

type RecordType = Api.External.Order.CreateOrderSales;

interface Props {
  form: FormInstance<RecordType>;
  onFinish: (values: RecordType) => void;
}

export default function Component(props: Props) {
  return (
    <Form form={props.form} onFinish={props.onFinish} layout="vertical">
      <Form.Item
        name="srcCompanyId"
        label="매출처"
        rules={[{ required: true }]}
      >
        <FormControl.SelectCompanySales />
      </Form.Item>
      <Form.Item name="wantedDate" label="마감 예정일">
        <FormControl.DatePicker />
      </Form.Item>
      <Form.Item name="memo" label="비고">
        <Input.TextArea maxLength={200} />
      </Form.Item>
      <Form.Item className="flex justify-end">
        <Button.Preset.Submit label="주문 등록" />
      </Form.Item>
    </Form>
  );
}
