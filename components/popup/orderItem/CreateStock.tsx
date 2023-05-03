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
  const [vendorStocks, page, setPage] =
    Api.External.VendorStock.useGetStockList(
      {
        companyId: Util.falsyToUndefined(props.open)?.dstCompany.id,
      },
      !props.open
    );
  const [selected, setSelected] = useState<Record.VendorStock[]>([]);
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
      title="재고 주문 추가"
      {...props}
      open={!!props.open}
      width={showVendorStock ? "calc(100vw - 100px)" : "480px"}
      height="calc(100vh - 200px)"
    >
      <div className="flex-1 flex flex-row">
        {showVendorStock && (
          <div className="flex-1 flex flex-col w-0 p-4 gap-y-4">
            <Toolbar.Container>
              <div className="flex-1" />
              <Toolbar.ButtonPreset.Continue
                label="재고 정보 불러오기"
                disabled={!only}
                onClick={async () => await applyStock()}
              />
            </Toolbar.Container>
            <Table.Default<Record.VendorStock>
              data={vendorStocks.data}
              page={page}
              setPage={setPage}
              keySelector={(record) => record.id}
              selected={selected}
              onSelectedChange={setSelected}
              selection="single"
              columns={[
                {
                  title: "창고",
                  dataIndex: ["warehouse", "name"],
                },
                {
                  title: "주소",
                  dataIndex: ["warehouse", "address"],
                  render: (value) => <div>{Util.formatAddress(value)}</div>,
                },
                {
                  title: "포장",
                  dataIndex: ["packaging", "type"],
                  render: (value, record) => (
                    <div className="font-fixed flex gap-x-1">
                      <div className="flex-initial flex flex-col justify-center text-lg">
                        <Icon.PackagingType
                          packagingType={record.packaging.type}
                        />
                      </div>
                      <div className="flex-initial flex flex-col justify-center">
                        {value}
                      </div>
                    </div>
                  ),
                },
                {
                  title: "단가",
                  dataIndex: ["price"],
                  render: (value, record) => (
                    <div className="font-fixed text-right whitespace-pre">
                      {`${Util.comma(value)} ${Util.formatPriceUnit(
                        record.packaging.type
                      ).padEnd(5)}`}
                    </div>
                  ),
                },
                {
                  title: "실물 수량",
                  dataIndex: ["cachedQuantity"],
                  render: (value, record) => (
                    <div className="font-fixed text-right whitespace-pre">
                      {record.packaging.type === "ROLL"
                        ? `${Util.comma(Util.gramsToTon(value ?? 0), 3)} t `
                        : `${value} 매`}
                    </div>
                  ),
                },
                {
                  title: "가용 수량",
                  dataIndex: ["cachedQuantity"],
                  render: (value, record) => (
                    <div className="font-fixed text-right whitespace-pre">
                      {record.packaging.type === "ROLL"
                        ? `${Util.comma(Util.gramsToTon(value ?? 0), 3)} t `
                        : `${value} 매`}
                    </div>
                  ),
                },
                {
                  title: "제품유형",
                  dataIndex: ["product", "paperDomain", "name"],
                },
                {
                  title: "제지사",
                  dataIndex: ["product", "manufacturer", "name"],
                },
                {
                  title: "지군",
                  dataIndex: ["product", "paperGroup", "name"],
                },
                {
                  title: "지종",
                  dataIndex: ["product", "paperType", "name"],
                },
                {
                  title: "색군",
                  dataIndex: ["paperColorGroup", "name"],
                },
                {
                  title: "색상",
                  dataIndex: ["paperColor", "name"],
                },
                {
                  title: "무늬",
                  dataIndex: ["paperPattern", "name"],
                },
                {
                  title: "인증",
                  dataIndex: ["paperCert", "name"],
                },
              ]}
            />
          </div>
        )}
        <div className="basis-px bg-gray-200" />
        <div className="basis-[480px] flex flex-col overflow-y-scroll">
          <div className="p-4 flex flex-col gap-y-4">
            <Toolbar.Container>
              {!showVendorStock && (
                <Toolbar.ButtonPreset.List
                  label="매입처 재고 조회"
                  onClick={() => setShowVendorStock(true)}
                  disabled={isVirtual}
                  tooltip={
                    isVirtual
                      ? "가상 매입처는 재고 조회가 불가능합니다."
                      : undefined
                  }
                />
              )}
              {showVendorStock && (
                <Toolbar.ButtonPreset.List
                  label="매입처 재고 닫기"
                  onClick={() => setShowVendorStock(false)}
                />
              )}
            </Toolbar.Container>
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
