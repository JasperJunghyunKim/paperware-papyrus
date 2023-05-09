import { FormControl } from "@/components";
import { Form } from "antd";

export default function Component() {
  return (
    <div
      className={
        "p-6 rounded-lg basis-1/5 flex-grow-0 flex flex-row justify-center border border-solid border-gray-200 select-none bg-white shadow-sm"
      }
    >
      <Form layout="vertical">
        <Form.Item name="paperCertId" label="거래처">
          <FormControl.SelectPartner />
        </Form.Item>
        <Form.Item name="collectedFromDate" label="수금일">
          <FormControl.DatePicker />
        </Form.Item>
        <Form.Item name="collectedToDate">
          <FormControl.DatePicker />
        </Form.Item>
        <Form.Item name="subject" label="계정과목">
          <FormControl.SelectPaidSubject />
        </Form.Item>
        <Form.Item name="method" label="수금">
          <FormControl.SelectMethod />
        </Form.Item>
      </Form>
    </div>
  );
}
