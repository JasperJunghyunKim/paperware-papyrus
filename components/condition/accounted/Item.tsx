import { SelectPartner } from "@/components/formControl";
import { Button, Form, Input } from "antd";

interface Props {
  label?: string;
  value?: string;
  iconClassName?: string;
}

export default function Component(props: Props) {
  return (
    <div
      className={
        "p-6 rounded-lg basis-1/5 flex-grow-0 flex flex-row justify-center border border-solid border-gray-200 select-none bg-white shadow-sm"
      }
    >
      <Form layout="vertical">
        <SelectPartner />

        <Form.Item
          name="businessName"
          label="상호명"
          rules={[{ required: true }]}
        >
          <Input maxLength={20} />
        </Form.Item>
        <Form.Item name="phoneNo" label="대표 전화">
          <Input maxLength={20} />
        </Form.Item>
        <Form.Item name="faxNo" label="팩스">
          <Input maxLength={20} />
        </Form.Item>
        <Form.Item name="email" label="이메일">
          <Input maxLength={20} />
        </Form.Item>
        <Form.Item className="flex justify-end">

        </Form.Item>
      </Form>
    </div>
  );
}
