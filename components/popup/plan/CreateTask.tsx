import { Api } from "@/common";
import { Record } from "@/common/protocol";
import { Button, FormControl, Popup } from "@/components";
import { Form, Input } from "antd";
import { useForm } from "antd/lib/form/Form";
import { useCallback, useState } from "react";

export interface Props {
  planId: number;
  open: boolean;
  onClose: (unit: boolean) => void;
}

export default function Component(props: Props) {
  const [type, setType] = useState<Record.TaskType>("CONVERTING");

  return (
    <Popup.Template.Property title="공정 추가" {...props}>
      <div className="flex-1 flex flex-col">
        <div className="flex-initial flex p-2 pb-0 bg-gray-200 gap-x-2">
          <TaskTab
            label="컨버팅"
            taskType="CONVERTING"
            value={type}
            onClick={setType}
          />
          <TaskTab
            label="길로틴"
            taskType="GUILLOTINE"
            value={type}
            onClick={setType}
          />
        </div>
        <div className="basis-px bg-gray-400" />
        <div className="flex-1">
          {type === "CONVERTING" && (
            <ConvertingForm planId={props.planId} onClose={props.onClose} />
          )}
          {type === "GUILLOTINE" && (
            <GuillotineForm planId={props.planId} onClose={props.onClose} />
          )}
        </div>
      </div>
    </Popup.Template.Property>
  );
}

interface TaskTabProps {
  taskType: Record.TaskType;
  label: string;
  value: Record.TaskType;
  onClick: (value: Record.TaskType) => void;
}
function TaskTab(props: TaskTabProps) {
  const active = props.taskType === props.value;

  return (
    <div
      className={`flex-1 flex items-center justify-center cursor-pointer p-4 font-bold rounded-t border border-gray-400 border-solid border-b-0 bg-white ${
        active ? "bg-sky-800 text-white" : ""
      }`}
      onClick={() => props.onClick(props.taskType)}
    >
      {props.label}
    </div>
  );
}

interface TaskFormProps {
  planId: number;
  onClose: (unit: boolean) => void;
}
function ConvertingForm(props: TaskFormProps) {
  const [form] = useForm<Api.Internal.Plan.CreateConvertingTask>();
  const api = Api.Internal.Plan.useCreateConvertingTask();
  const cmd = useCallback(
    async (values: Api.Internal.Plan.CreateConvertingTask) => {
      await api.mutateAsync({ data: { ...values, planId: props.planId } });
      form.resetFields();
      props.onClose(false);
    },
    [api, form, props]
  );

  return (
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
  );
}

function GuillotineForm(props: TaskFormProps) {
  const [form] = useForm<Api.Internal.Plan.CreateGuillotineTask>();
  const api = Api.Internal.Plan.useCreateGuillotineTask();
  const cmd = useCallback(
    async (values: Api.Internal.Plan.CreateGuillotineTask) => {
      await api.mutateAsync({ data: { ...values, planId: props.planId } });
      form.resetFields();
      props.onClose(false);
    },
    [api, form, props]
  );

  return (
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
        <Button.Preset.Submit label="길로틴 추가" />
      </Form.Item>
    </Form>
  );
}
