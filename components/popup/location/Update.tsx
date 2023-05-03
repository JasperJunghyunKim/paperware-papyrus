import { Api } from "@/common";
import { Popup } from "@/components";
import { useForm } from "antd/lib/form/Form";
import { useCallback, useEffect, useState } from "react";
import FormUpdate from "./common/FormUpdate";

export interface Props {
  open: number | false;
  onClose: (unit: false) => void;
}

export default function Component(props: Props) {
  const [form] = useForm<Api.Internal.Location.CreateLocation>();
  const [edit, setEdit] = useState(false);

  const api = Api.Internal.Location.useUpdateLocation();
  const cmd = useCallback(
    async (values: Api.Internal.Location.CreateLocation) => {
      if (!props.open) {
        return;
      }

      await api.mutateAsync({ id: props.open, data: values });
      setEdit(false);
    },
    [api, props]
  );

  const data = Api.Internal.Location.useGetLocation(props.open);
  useEffect(() => {
    if (!data.data || edit) {
      return;
    }

    form.setFieldsValue({
      name: data.data.name,
      code: data.data.code,
      isPublic: data.data.isPublic,
      address: data.data.address,
    });
  }, [form, data.data, edit]);
  return (
    <Popup.Template.Property title="도착지 상세" {...props} open={!!props.open}>
      <div className="flex-1 p-4">
        <FormUpdate
          form={form}
          edit={edit}
          onFinish={async (values) => await cmd(values)}
          onEditChange={(edit) => setEdit(edit)}
        />
      </div>
    </Popup.Template.Property>
  );
}
