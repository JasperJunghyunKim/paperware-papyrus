import { Api, Util } from "@/common";
import { Record } from "@/common/protocol";
import { Popup, Toolbar } from "@/components";
import { useForm } from "antd/lib/form/Form";
import classNames from "classnames";
import { useCallback, useEffect, useState } from "react";
import { TbClipboardData } from "react-icons/tb";
import { FormUpdate } from "./common";

export interface Props {
  open: number | false;
  onClose: (unit: false) => void;
}

export default function Component(props: Props) {
  const [openStockCreate, setOpenStockCreate] = useState<Record.Order | false>(
    false
  );
  const [openStockUpdate, setOpenStockUpdate] = useState<number | false>(false);

  const [form] = useForm<Api.External.Order.UpdateOrder>();

  const order = Api.External.Order.useGetOrder(props.open);
  const [orderStocks, _page, _setPage] =
    Api.External.OrderItem.Stock.useGetOrderStockList(
      {
        orderId: order.data?.id,
      },
      !order.data
    );

  const me = Api.Auth.useGetMe();

  const api = Api.External.Order.useUpdateOrder();
  const cmd = useCallback(
    async (values: Api.External.Order.UpdateOrder) => {
      if (!props.open) {
        return;
      }

      await api.mutateAsync({ id: props.open, data: values });
    },
    [api, props]
  );

  const apiContinue = Api.External.Order.useOrderAccept(order.data?.id ?? null);
  const cmdContinue = useCallback(async () => {
    if (
      !order.data ||
      !(await Util.confirm("선택한 주문으로 수주 진행하시겠습니까?"))
    ) {
      return;
    }

    await apiContinue.mutateAsync({
      data: {
        id: order.data.id,
      },
    });
  }, [apiContinue, order.data]);

  useEffect(() => {
    if (!order.data) {
      form.resetFields();
      return;
    }

    form.setFieldsValue({
      wantedDate: order.data.wantedDate,
      memo: order.data.memo,
    });
  }, [form, order.data]);

  const isVirtual = order.data && order.data.dstCompany.managedById !== null;

  return (
    <Popup.Template.Full
      {...props}
      title={`매출 주문 상세`}
      open={!!props.open}
      width="calc(100vw - 80px)"
      height="calc(100vh - 80px)"
    >
      <div className="flex-initial flex flex-row basis-80 p-4">
        {order.data && (
          <FormUpdate
            order={order.data}
            form={form}
            onFinish={async (values) => await cmd(values)}
          />
        )}
      </div>
      <div className="basis-px bg-gray-200" />
      <div className="flex-1 flex-grow p-4 flex flex-col gap-y-4">
        {order.data && Util.inc(order.data.status, "PREPARING") && (
          <Toolbar.Container>
            <Toolbar.ButtonPreset.Create
              label="재고 매출"
              onClick={() => order.data && setOpenStockCreate(order.data)}
            />
            <div className="flex-1" />
            <Toolbar.ButtonPreset.Send
              label="수주 진행"
              onClick={cmdContinue}
              disabled={
                orderStocks.data?.count === 0 ||
                !Util.inc(order.data.status, "PREPARING", "REQUESTED")
              }
            />
          </Toolbar.Container>
        )}
        <OrderItemContainer orderStocks={orderStocks.data?.items ?? []} />
        <Popup.OrderItem.CreateStockSales
          open={openStockCreate}
          onClose={() => setOpenStockCreate(false)}
        />
      </div>
    </Popup.Template.Full>
  );
}

function OrderItemContainer(props: { orderStocks: Record.OrderStock[] }) {
  return (
    <div className="flex-1 overflow-y-scroll">
      <div className="flex-1 flex flex-col gap-y-4">
        {props.orderStocks.map((orderStock) => (
          <OrderItem key={orderStock.id} value={orderStock} />
        ))}
      </div>
    </div>
  );
}

function OrderItem(props: { value: Record.OrderStock }) {
  const hasLocation = props.value.dstLocation !== null;

  return (
    <div className="flex-initial flex flex-col gap-x-4 border border-solid border-slate-300 rounded-md overflow-hidden">
      <div className="flex-initial bg-slate-200 p-2 font-bold flex flex-row gap-x-2">
        <div className="flex-initial font-fixed text-cyan-800">0001</div>
        <div className="basis-1 bg-slate-300" />
        <div className="flex-1 flex -mt-px">
          {hasLocation
            ? `재고 주문 (배송지: ${props.value.dstLocation?.name})`
            : `재고 주문 (보관)`}
        </div>
      </div>
      <div className="flex-initial p-2 flex flex-row gap-x-4">
        <OrderItemProperty
          label="제품 유형"
          content={props.value.product.paperDomain.name}
        />
        <OrderItemProperty
          label="제지사"
          content={props.value.product.manufacturer.name}
        />
        <OrderItemProperty
          label="지군"
          content={props.value.product.paperGroup.name}
        />
        <OrderItemProperty
          label="지종"
          content={props.value.product.paperType.name}
        />
        <OrderItemProperty
          label="평량"
          content={`${Util.comma(props.value.grammage).padStart(4)} ${
            Util.UNIT_GPM
          }`}
        />
        {props.value.paperColorGroup && (
          <OrderItemProperty
            label="색군"
            content={props.value.paperColorGroup.name}
          />
        )}
        {props.value.paperColor && (
          <OrderItemProperty
            label="색상"
            content={props.value.paperColor.name}
          />
        )}
        {props.value.paperPattern && (
          <OrderItemProperty
            label="무늬"
            content={props.value.paperPattern.name}
          />
        )}
        {props.value.paperCert.length !== 0 && (
          <OrderItemProperty
            label="인증"
            content={props.value.paperCert.map((p) => p.name).join(", ")}
          />
        )}
        <OrderItemProperty
          label="규격"
          content={Util.formatPackaging(props.value.packaging)}
        />
      </div>
      <div className="basis-px bg-gray-200" />
      <div className="flex-initial p-2 flex flex-row gap-x-4">
        <OrderItemProperty
          label="주문 지폭"
          content={`${Util.comma(props.value.sizeX)} mm`}
          type="highlight"
          rightAlign
        />
        <OrderItemProperty
          label="주문 지장"
          content={`${Util.comma(props.value.sizeY)} mm`}
          type="highlight"
          rightAlign
        />
        <OrderItemProperty
          label="주문 수량"
          content={Util.comma(props.value.quantity)}
          type="highlight"
          rightAlign
        />
        <OrderItemProperty
          label="주문 중량"
          content={`TODO`}
          type="highlight"
          rightAlign
        />
        <div className="basis-px bg-gray-200" />
        {props.value.dstLocation && (
          <OrderItemProperty
            label="도착지"
            content={props.value.dstLocation?.name ?? ""}
            type="highlight"
          />
        )}
      </div>
      {Util.inc(props.value.order.status, "ACCEPTED") && (
        <>
          <div className="basis-px bg-gray-200" />
          <div className="flex-initial p-2 flex flex-row gap-x-4 bg-amber-200 font-bold">
            매입정보
          </div>
          <div className="basis-px bg-gray-200" />
          <div className="flex-initial p-2 flex flex-row gap-x-4 bg-yellow-50">
            <OrderItemProperty
              label="대제 지폭"
              content={`${Util.comma(props.value.sizeY)} mm`}
              type="warning"
              rightAlign
            />
            <OrderItemProperty
              label="대제 지장"
              content={`${Util.comma(props.value.sizeY)} mm`}
              type="warning"
              rightAlign
            />
            <OrderItemProperty
              label="대체 수량"
              content={Util.comma(props.value.quantity)}
              type="warning"
              rightAlign
            />
          </div>
          <div className="basis-px bg-gray-200" />
          <div className="flex-initial p-2 flex flex-row gap-x-4 bg-yellow-50">
            <div className="flex-initial font-fixed text-gray-600">
              {`고시가 (도가)`}
            </div>
            <div className="flex-initial font-fixed whitespace-pre font-bold">
              {`1,234,567원`.padStart(14)}
            </div>
            <div className="basis-px bg-gray-300" />
            <div className="flex-initial font-fixed text-gray-600 ">
              {`할인율`}
            </div>
            <div className="flex-initial font-fixed whitespace-pre font-bold">
              {`12.345%`.padStart(14)}
            </div>
            <div className="basis-px bg-gray-300" />
            <div className="flex-initial font-fixed text-gray-600">
              {`공급가`}
            </div>
            <div className="flex-initial font-fixed whitespace-pre font-bold">
              {`1,234,567원`.padStart(14)}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

interface OrderItemPropertyProps {
  label: string;
  content?: string;
  rightAlign?: boolean;
  type?: "default" | "highlight" | "warning";
}
function OrderItemProperty(props: OrderItemPropertyProps) {
  const type = props.type ?? "default";

  return (
    <div className="flex-initial flex flex-col gap-y-1">
      <div
        className={classNames("flex-initial flex  text-xs font-bold", {
          "text-gray-500": type === "default",
          "text-cyan-800": type === "highlight",
          "text-amber-700": type === "warning",
        })}
      >
        {props.label}
      </div>
      <div
        className={classNames("flex-initial flex font-fixed whitespace-pre", {
          "justify-end": props.rightAlign,
        })}
      >
        {props.content}
      </div>
    </div>
  );
}
