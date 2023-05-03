import { Api, Util } from "@/common";
import { Button, FormControl, Popup } from "@/components";
import { Form } from "antd";
import { useForm } from "antd/lib/form/Form";
import { useCallback } from "react";

export interface Props {
  stockEventId: number;
  open: boolean;
  onClose: (unit: boolean) => void;
}

export default function Component(props: Props) {
  const [form] = useForm<Api.Internal.StockArrival.ApplyStockArrival>();

  const api = Api.Internal.StockArrival.useApplyStockArrival();
  const cmd = useCallback(
    async (values: Api.Internal.StockArrival.ApplyStockArrival) => {
      if (!(await Util.confirm("입고 처리하시겠습니까?"))) {
        return;
      }

      await api.mutateAsync({
        data: {
          stockEventId: props.stockEventId,
          warehouseId: values.warehouseId,
        },
      });
      props.onClose(true);
    },
    [api, props]
  );

  return (
    <Popup.Template.Property title="입고 등록" {...props}>
      <div className="flex-1 flex flex-col">
        <div className="flex-1">
          <Form
            form={form}
            layout="vertical"
            onFinish={cmd}
            rootClassName="flex-1 p-4"
          >
            <Form.Item
              label="창고"
              name="warehouseId"
              rules={[{ required: true, message: "창고를 지정해주세요." }]}
            >
              <FormControl.SelectWarehouse />
            </Form.Item>
            <Form.Item className="flex justify-end">
              <Button.Preset.Submit label="입고 완료" />
            </Form.Item>
          </Form>
        </div>
      </div>
    </Popup.Template.Property>
  );
}
