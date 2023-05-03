import { Api, Util } from "@/common";
import { Icon, Popup, Table, Toolbar } from "@/components";
import { useForm } from "antd/lib/form/Form";
import { useCallback, useEffect, useState } from "react";
import { FormCreateStock } from "./common";
import { Record } from "@/common/protocol";

export interface Props {
  open: Record.Order | false;
  onClose: (unit: false) => void;
}

export default function Component(props: Props) {
  const [stocks, page, setPage] = Api.Internal.Stock.useGetStockList(
    {},
    !props.open
  );
  const [selected, setSelected] = useState<Record.Stock[]>([]);
  const only = Util.only(selected);

  const [showVendorStock, setShowVendorStock] = useState(false);

  const [form] = useForm<Api.External.OrderItem.Stock.CreateOrderStock>();

  const applyStock = useCallback(async () => {
    if (!only) {
      return;
    }

    form.setFieldsValue({
      productId: only.product.id,
      packagingId: only.packaging.id,
      grammage: only.grammage,
      sizeX: only.sizeX,
      sizeY: only.sizeY,
      paperColorGroupId: only.paperColorGroup?.id,
      paperColorId: only.paperColor?.id,
      paperPatternId: only.paperPattern?.id,
      paperCertId: only.paperCert?.map((cert) => cert.id),
    });

    setSelected([]);
    setShowVendorStock(false);
  }, [only, form]);

  const api = Api.External.OrderItem.Stock.useCreateOrderStock();
  const cmd = useCallback(
    async (values: Api.External.OrderItem.Stock.CreateOrderStock) => {
      const orderId = Util.falsyToUndefined(props.open)?.id;
      if (!orderId) {
        return;
      }

      await api.mutateAsync({
        data: {
          ...values,
          orderId,
        },
      });
      form.resetFields();
      props.onClose(false);
    },
    [api, form, props]
  );

  const isVirtual = props.open && props.open.dstCompany.managedById !== null;

  useEffect(() => {
    if (props.open) {
      form.resetFields();
      setShowVendorStock(false);
      setSelected([]);
    }
  }, [form, props.open]);

  return (
    <Popup.Template.Full
      title="재고 매출 추가"
      {...props}
      open={!!props.open}
      width={showVendorStock ? "calc(100vw - 100px)" : "480px"}
      height="calc(100vh - 200px)"
    >
      <div className="flex-1 flex flex-row">
        <div className="basis-[480px] flex flex-col overflow-y-scroll">
          <div className="p-4 flex flex-col gap-y-4">
            <FormCreateStock
              form={form}
              onFinish={async (values) => await cmd(values)}
            />
          </div>
        </div>
      </div>
    </Popup.Template.Full>
  );
}
