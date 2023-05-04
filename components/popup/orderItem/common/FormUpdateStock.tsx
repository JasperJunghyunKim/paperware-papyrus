import { Api } from "@/common";
import { Button, FormControl } from "@/components";
import { Form, FormInstance, Input, Radio, Select } from "antd";
import { useWatch } from "antd/lib/form/Form";
import { useCallback, useState } from "react";

type RecordType = Api.External.OrderItem.Stock.CreateOrderStock;

type ShippingType = "DELIVERY" | "PICKUP" | "STORE";

interface Props {
  form: FormInstance<RecordType>;
  onFinish: (values: RecordType) => void;
}

export default function Component(props: Props) {
  const staticData = Api.Static.PaperMetadata.useGetAll();
  const packagingId = useWatch(["packagingId"], props.form);

  const [showLocation, setShowLocation] = useState<ShippingType>("DELIVERY");

  const selectedPackaging = staticData.data?.packagings.find(
    (p) => p.id === packagingId
  );

  const finish = useCallback(
    (values: RecordType) => {
      props.onFinish({
        ...values,
        dstLocationId:
          showLocation === "DELIVERY" ? values.dstLocationId : null,
      });
    },
    [props, showLocation]
  );

  return (
    <Form form={props.form} onFinish={finish} layout="vertical">
      <Form.Item name="productId" label="제품" rules={[{ required: true }]}>
        <FormControl.SelectProduct />
      </Form.Item>
      <Form.Item name="packagingId" label="포장" rules={[{ required: true }]}>
        <FormControl.SelectPackaging />
      </Form.Item>
      <div className="flex gap-x-2">
        <Form.Item
          name="grammage"
          label="평량"
          rules={[{ required: true }]}
          rootClassName="flex-1"
        >
          <FormControl.Number min={0} max={9999} pricision={0} unit="g/㎡" />
        </Form.Item>
        <Form.Item
          name="sizeX"
          label="지폭"
          rules={[{ required: true }]}
          rootClassName="flex-1"
        >
          <FormControl.Number min={0} max={9999} pricision={0} unit="mm" />
        </Form.Item>
        {selectedPackaging?.type !== "ROLL" && (
          <Form.Item
            name="sizeY"
            label="지장"
            rules={[{ required: true }]}
            rootClassName="flex-1"
          >
            <FormControl.Number min={0} max={9999} pricision={0} unit="mm" />
          </Form.Item>
        )}
      </div>
      <div className="flex gap-x-2">
        <Form.Item name="paperColorGroupId" label="색군" rootClassName="flex-1">
          <FormControl.SelectColorGroup />
        </Form.Item>
        <Form.Item name="paperColorId" label="색상" rootClassName="flex-1">
          <FormControl.SelectColor />
        </Form.Item>
        <Form.Item name="paperPatternId" label="무늬" rootClassName="flex-1">
          <FormControl.SelectPattern />
        </Form.Item>
      </div>
      <Form.Item name="paperCertIds" label="인증">
        <FormControl.SelectCert />
      </Form.Item>
      {selectedPackaging && (
        <Form.Item name="quantity" label="수량" rules={[{ required: true }]}>
          <FormControl.Quantity packaging={selectedPackaging} />
        </Form.Item>
      )}
      <Form.Item label="배송">
        <Radio.Group
          value={showLocation}
          onChange={(p) => setShowLocation(p.target.value)}
          options={[
            { label: "보관", value: "STORE" },
            { label: "배송", value: "DELIVERY" },
            { label: "픽업", value: "PICKUP", disabled: true },
          ]}
          optionType="button"
        />
      </Form.Item>
      {showLocation === "DELIVERY" && (
        <Form.Item
          name="dstLocationId"
          label="배송지"
          rules={[{ required: true }]}
        >
          <FormControl.SelectLocation />
        </Form.Item>
      )}
      <Form.Item name="memo" label="메모">
        <Input.TextArea maxLength={200} />
      </Form.Item>
      <Form.Item className="flex justify-end">
        <Button.Preset.Submit label="재고 주문 추가" />
      </Form.Item>
    </Form>
  );
}
