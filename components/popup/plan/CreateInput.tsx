import { Api } from "@/common";
import { Button, FormControl, Popup } from "@/components";
import { Form } from "antd";
import { useForm, useWatch } from "antd/lib/form/Form";
import { useCallback } from "react";

export interface Props {
  planId: number;
  open: boolean;
  onClose: (unit: boolean) => void;
}

export default function Component(props: Props) {
  const [form] = useForm<Api.Internal.Plan.CreateOutput>();
  const staticData = Api.Static.Paper.useGetAll();
  const packagingId = useWatch(["packagingId"], form);

  const selectedPackaging = staticData.data?.packaging.find(
    (p) => p.id === packagingId
  );

  const apiCreate = Api.Internal.Plan.useCreateOutput(props.planId);
  const cmdCreate = useCallback(async () => {
    const values = await form.validateFields();
    await apiCreate.mutateAsync({ data: values });
    props.onClose(true);
  }, [apiCreate, form, props]);

  return (
    <Popup.Template.Property title="공정 추가" {...props}>
      <div className="flex-1 p-4">
        <Form form={form} onFinish={cmdCreate} layout="vertical">
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
          <div className="flex gap-x-2">
            <Form.Item
              name="grammage"
              label="평량"
              rules={[{ required: true }]}
              rootClassName="flex-1"
            >
              <FormControl.Number
                min={0}
                max={9999}
                pricision={0}
                unit="g/㎡"
              />
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
                <FormControl.Number
                  min={0}
                  max={9999}
                  pricision={0}
                  unit="mm"
                />
              </Form.Item>
            )}
          </div>
          <div className="flex gap-x-2">
            <Form.Item
              name="paperColorGroupId"
              label="색군"
              rootClassName="flex-1"
            >
              <FormControl.SelectColorGroup />
            </Form.Item>
            <Form.Item name="paperColorId" label="색상" rootClassName="flex-1">
              <FormControl.SelectColor />
            </Form.Item>
            <Form.Item
              name="paperPatternId"
              label="무늬"
              rootClassName="flex-1"
            >
              <FormControl.SelectPattern />
            </Form.Item>
          </div>
          <Form.Item name="paperCertIds" label="인증">
            <FormControl.SelectCert />
          </Form.Item>
          {selectedPackaging && (
            <Form.Item name="quantity" label="수량" required>
              <FormControl.Quantity packaging={selectedPackaging} />
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
