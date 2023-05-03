import { Api, Util } from "@/common";
import { Record } from "@/common/protocol";
import { FormControl, Toolbar } from "@/components";
import { Form, FormInstance, Input } from "antd";

type RecordType = Api.External.Order.UpdateOrder;

interface Props {
  order: Record.Order;
  form: FormInstance<RecordType>;
  onFinish: (values: RecordType) => void;
}

export default function Component(props: Props) {
  const isVirtual = props.order.dstCompany.managedById !== null;
  const preparing = Util.inc(props.order.status, "PREPARING");

  return (
    <Form
      form={props.form}
      onFinish={props.onFinish}
      layout="vertical"
      rootClassName="flex-1"
      disabled={!preparing}
    >
      <div className="flex flex-col gap-y-4">
        {preparing && (
          <Toolbar.Container>
            <div className="flex-1" />
            <Toolbar.ButtonPreset.Continue label="주문 저장" />
          </Toolbar.Container>
        )}
        <div className="flex-auto">
          <Form.Item label="주문 번호">
            <Input readOnly value={props.order.orderNo} />
          </Form.Item>
          <Form.Item label="매입처">
            <Input
              readOnly
              value={
                isVirtual
                  ? `(가상) ${props.order.dstCompany.businessName}`
                  : `${props.order.dstCompany.businessName}`
              }
            />
          </Form.Item>
          <Form.Item label="주문 상태">
            <Input
              readOnly
              value={Util.orderStatusToString(props.order.status)}
            />
          </Form.Item>
          <Form.Item name="wantedDate" label="마감 희망일">
            <FormControl.DatePicker />
          </Form.Item>
          <Form.Item name="memo" label="기타 요청사항">
            <Input.TextArea maxLength={200} />
          </Form.Item>
        </div>
      </div>
    </Form>
  );
}
