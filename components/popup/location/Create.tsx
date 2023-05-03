import { Api } from "@/common";
import { Popup } from "@/components";
import { useCallback } from "react";
import { FormCreate } from "./common";
import { useForm } from "antd/lib/form/Form";

export interface Props {
  open: boolean;
  onClose: (unit: boolean) => void;
}

export default function Component(props: Props) {
  const [form] = useForm<Api.Internal.Location.CreateLocation>();

  const api = Api.Internal.Location.useCreateLocation();
  const cmd = useCallback(
    async (values: Api.Internal.Location.CreateLocation) => {
      await api.mutateAsync({ data: values });
      form.resetFields();
      props.onClose(false);
    },
    [api, form, props]
  );

  return (
    <Popup.Template.Property title="도착지 추가" {...props}>
      <div className="flex-1 p-4">
        <FormCreate
          form={form}
          onFinish={async (values) => await cmd(values)}
        />
      </div>
    </Popup.Template.Property>
  );
}
