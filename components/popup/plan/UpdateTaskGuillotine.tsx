import { Api } from "@/common";
import { Button, FormControl, Popup } from "@/components";
import { Form, Input } from "antd";
import { useForm } from "antd/lib/form/Form";
import { useCallback } from "react";

export interface Props {
  taskId: number;
  open: boolean;
  onClose: (unit: boolean) => void;
}

export default function Component(props: Props) {
  const [form] = useForm<Api.Internal.Plan.UpdateConvertingTask>();
  const api = Api.Internal.Plan.useUpdateConvertingTask(props.taskId);
  const cmd = useCallback(
    async (values: Api.Internal.Plan.UpdateConvertingTask) => {
      await api.mutateAsync({ data: values });
      form.resetFields();
      props.onClose(false);
    },
    [api, form, props]
  );

  return (
    <Popup.Template.Property title="컨버팅 수정" {...props}>
      <div className="flex-1">
        <Form
          form={form}
          layout="vertical"
          onFinish={cmd}
          rootClassName="flex-1 p-4"
        >
          <Form.Item
            label="지폭"
            name="sizeX"
            rules={[{ required: true, message: "지폭을 입력해주세요." }]}
          >
            <FormControl.Number min={0} max={9999} unit="mm" />
          </Form.Item>
          <Form.Item
            label="지장"
            name="sizeY"
            rules={[{ required: true, message: "지장을 입력해주세요." }]}
          >
            <FormControl.Number min={0} max={9999} unit="mm" />
          </Form.Item>
          <Form.Item label="비고" name="memo">
            <Input.TextArea maxLength={100} />
          </Form.Item>
          <Form.Item className="flex justify-end">
            <Button.Preset.Submit label="컨버팅 추가" />
          </Form.Item>
        </Form>
      </div>
    </Popup.Template.Property>
  );
}
