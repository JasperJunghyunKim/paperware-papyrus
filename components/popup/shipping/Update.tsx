import { Api } from "@/common";
import { Record } from "@/common/protocol";
import { Popup, Table, Toolbar } from "@/components";
import { useCallback, useState } from "react";

export interface Props {
  open: number | false;
  onClose: (unit: false) => void;
}

export default function Component(props: Props) {
  const [openInvoice, setOpenInvoice] = useState<number | false>(false);

  const [invoice, page, setPage] = Api.Internal.Invoice.useGetList({});

  const api = Api.Internal.Warehouse.useUpdateWarehouse();
  const cmd = useCallback(
    async (values: Api.Internal.Warehouse.CreateWarehouse) => {
      if (!props.open) {
        return;
      }

      await api.mutateAsync({ id: props.open, data: values });
    },
    [api, props]
  );

  return (
    <Popup.Template.Full
      title="배송 상세"
      {...props}
      open={!!props.open}
      width="calc(100vw - 140px)"
      height="600px"
    >
      <div className="flex-1 p-4 flex flex-col gap-y-4">
        <div className="flex-initial">
          <Toolbar.Container>
            <Toolbar.ButtonPreset.Create
              label="송장 추가"
              onClick={() => setOpenInvoice(props.open)}
            />
          </Toolbar.Container>
        </div>
        <div className="flex-1 flex flex-col">
          <Table.Default<Record.Invoice>
            columns={[
              {
                title: "송장번호",
                dataIndex: "invoiceNo",
              },
            ]}
            data={invoice.data}
            keySelector={(item) => item.id}
            page={page}
            setPage={setPage}
            selection="single"
          />
        </div>
      </div>
      <Popup.Invoice.Create open={openInvoice} onClose={setOpenInvoice} />
    </Popup.Template.Full>
  );
}
