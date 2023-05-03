import { Api, Protocol } from "@/common";
import { Form, FormInstance, Input } from "antd";

interface Props {
  plan: Protocol.Record.Plan;
  form: FormInstance<Api.Internal.Warehouse.UpdateWarehouse>;
  onFinish: (values: Api.Internal.Warehouse.UpdateWarehouse) => void;
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
      <Form.Item label="작업 계획 번호">
        <Input value={props.plan.planNo} disabled />
      </Form.Item>
    </Form>
  );
}
