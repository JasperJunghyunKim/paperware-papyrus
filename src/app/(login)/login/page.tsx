"use client";

import { Form, Input } from "antd";
import { useForm } from "antd/lib/form/Form";

export default function Component() {
  const [form] = useForm();

  return (
    <div className=" w-screen h-screen flex justify-center items-center">
      <Form form={form} layout="vertical" rootClassName="flex-initial">
        <Form.Item name="username" label="아이디">
          <Input />
        </Form.Item>
        <Form.Item name="password" label="패스워드">
          <Input.Password />
        </Form.Item>
      </Form>
    </div>
  );
}
