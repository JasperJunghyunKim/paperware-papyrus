import { Api } from "@/@shared";
import { ApiHook, Util } from "@/common";
import { Button, FormControl, Popup } from "@/components";
import { Number } from "@/components/formControl";
import { Form } from "antd";
import { useForm, useWatch } from "antd/lib/form/Form";
import { useCallback } from "react";

type OrderId = number;
type OpenType = OrderId | false;
export interface Props {
  open: OpenType;
  onClose: (unit: false) => void;
}

export default function Component(props: Props) {
  const metadata = ApiHook.Static.PaperMetadata.useGetAll();

  const [form] = useForm<Api.OrderStockArrivalCreateRequest>();
  const packagingId = useWatch(["packagingId"], form);

  const packaging = metadata.data?.packagings.find((x) => x.id === packagingId);

  const api = ApiHook.Trade.OrderStock.useCreateArrival();
  const cmd = useCallback(
    async (values: Api.OrderStockArrivalCreateRequest) => {
      if (!props.open) return;

      await api.mutateAsync({
        orderId: props.open,
        data: values,
      });

      props.onClose(false);
    },
    [api, props]
  );

  return (
    <Popup.Template.Property title="재고 추가" {...props} open={!!props.open}>
      <div className="flex-1 p-4">
        <Form form={form} onFinish={cmd} layout="vertical">
          <Form.Item name="warehouseId" label="창고">
            <FormControl.SelectWarehouse />
          </Form.Item>
          <Form.Item name="productId" label="제품" rules={[{ required: true }]}>
            <FormControl.SelectProduct />
          </Form.Item>
          <Form.Item
            name="packagingId"
            label="포장"
            rules={[{ required: true }]}
          >
            <FormControl.SelectPackaging />
          </Form.Item>
          <Form.Item>
            <div className="flex justify-between gap-x-2">
              <Form.Item
                name="grammage"
                label="평량"
                rules={[{ required: true }]}
                rootClassName="flex-1"
              >
                <Number min={0} max={9999} pricision={0} unit={Util.UNIT_GPM} />
              </Form.Item>
              <Form.Item
                name="sizeX"
                label="지폭"
                rules={[{ required: true }]}
                rootClassName="flex-1"
              >
                <Number min={0} max={9999} pricision={0} unit="mm" />
              </Form.Item>
              <Form.Item
                name="sizeY"
                label="지장"
                rules={[{ required: true }]}
                rootClassName="flex-1"
              >
                <Number min={0} max={9999} pricision={0} unit="mm" />
              </Form.Item>
            </div>
          </Form.Item>
          <Form.Item name="paperColorGroupId" label="색군">
            <FormControl.SelectColorGroup />
          </Form.Item>
          <Form.Item name="paperColorId" label="색상">
            <FormControl.SelectColor />
          </Form.Item>
          <Form.Item name="paperPatternId" label="무늬">
            <FormControl.SelectPattern />
          </Form.Item>
          <Form.Item name="paperCertId" label="인증">
            <FormControl.SelectCert />
          </Form.Item>
          <Form.Item name="stockPrice" label="재고 금액">
            <FormControl.StockPrice />
          </Form.Item>
          {packaging && (
            <Form.Item name="quantity" label="재고 수량">
              <FormControl.Quantity packaging={packaging} />
            </Form.Item>
          )}
          <Form.Item className="flex justify-end">
            <Button.Preset.Submit label="재고 추가" />
          </Form.Item>
        </Form>
      </div>
    </Popup.Template.Property>
  );
}
