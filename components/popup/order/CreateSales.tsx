import { Api } from "@/common";
import { Popup } from "@/components";
import { useForm } from "antd/lib/form/Form";
import { useCallback } from "react";
import { FormCreateSales } from "./common";

export interface Props {
  open: boolean;
  onClose: (unit: boolean) => void;
}

export default function Component(props: Props) {
  const [form] = useForm<Api.External.Order.CreateOrderSales>();

  const api = Api.External.Order.useCreateOrderSales();
  const cmd = useCallback(
    async (values: Api.External.Order.CreateOrderSales) => {
      await api.mutateAsync({ data: values });
      form.resetFields();
      props.onClose(false);
    },
    [api, form, props]
  );

  return (
    <Popup.Template.Property title="새 수주 등록" {...props}>
      <div className="flex-1 p-4">
        <FormCreateSales
          form={form}
          onFinish={async (values) => await cmd(values)}
        />
      </div>
    </Popup.Template.Property>
  );
}
