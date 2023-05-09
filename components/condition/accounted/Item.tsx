import { FormControl } from "@/components";
import { Form } from "antd";

export default function Component() {
  return (
    <div
      className={
        "p-6 rounded-lg basis-3/5 flex-grow-0 flex flex-row justify-center border border-solid border-gray-200 select-none bg-white shadow-sm"
      }
    >
      <Form layout={"vertical"} className={"flex flex-row gap-4 w-full"}>
        <Form.Item name="paperCertId" label="거래처" className={"w-1/5"}>
          <FormControl.SelectPartner />
        </Form.Item>
        <Form.Item name="collectedFromDate" label="수금일" className={"w-1/5"}>
          <FormControl.DatePicker />
        </Form.Item>
        <div className={"mt-8"}>
          ~
        </div>
        <Form.Item name="collectedToDate" label=" " className={"w-1/5 mt-30"}>
          <FormControl.DatePicker />
        </Form.Item>
        <Form.Item name="subject" label="계정 과목" className={"w-1/5"}>
          <FormControl.SelectPaidSubject />
        </Form.Item>
        <Form.Item name="method" label="지급 수단" className={"w-1/5"}>
          <FormControl.SelectMethod />
        </Form.Item>
      </Form>
    </div>
  );
}
