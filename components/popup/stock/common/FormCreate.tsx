import { Api } from "@/common";
import { Button, FormControl } from "@/components";
import { Form, FormInstance } from "antd";
import { useWatch } from "antd/lib/form/Form";

interface Props {
  form: FormInstance<Api.Internal.Stock.CreateStock>;
  onFinish: (values: Api.Internal.Stock.CreateStock) => void;
}

export default function Component(props: Props) {
  const staticData = Api.Static.Paper.useGetAll();
  const packagingId = useWatch(["packagingId"], props.form);
  const grammage = useWatch(["grammage"], props.form);
  const sizeX = useWatch(["sizeX"], props.form);
  const sizeY = useWatch(["sizeY"], props.form);

  const selectedPackaging = staticData.data?.packaging.find(
    (p) => p.id === packagingId
  );

  return (
    <Form form={props.form} onFinish={props.onFinish} layout="vertical">
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
      <Form.Item name="warehouseId" label="창고">
        <FormControl.SelectWarehouse />
      </Form.Item>
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
        <Form.Item name="price" label="단가" required>
          <FormControl.Price
            packaging={selectedPackaging}
            grammage={grammage}
            sizeX={sizeX}
            sizeY={sizeY}
          />
        </Form.Item>
      )}
      {selectedPackaging && (
        <Form.Item name="quantity" label="수량" required>
          <FormControl.Quantity packaging={selectedPackaging} />
        </Form.Item>
      )}
      <Form.Item className="flex justify-end">
        <Button.Preset.Submit label="재고 추가" />
      </Form.Item>
    </Form>
  );
}
