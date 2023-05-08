import { ApiHook } from "@/common";
import { Popup } from "@/components";
import classNames from "classnames";
import { TaskMap } from "./common";

export interface Props {
  open: number | false;
  onClose: (unit: false) => void;
}

export default function Component(props: Props) {
  const data = ApiHook.Working.Plan.useGetItem({
    id: props.open ? props.open : null,
  });

  return (
    <Popup.Template.Full
      title="작업 계획 상세"
      {...props}
      open={!!props.open}
      width="calc(100vw - 80px)"
      height="calc(100vh - 80px)"
    >
      <div className="flex-[1_0_0px] flex flex-col">
        {data.data && (
          <div className="flex-initial p-4 flex gap-x-8">
            <OrderItemProperty
              label="작업 계획 번호"
              content={data.data.planNo}
            />
            <OrderItemProperty
              label="원지 창고"
              content={
                data.data.targetStockGroupEvent.stockGroup.warehouse?.name
              }
            />
            <OrderItemProperty
              label="제품 유형"
              content={
                data.data.targetStockGroupEvent.stockGroup.product.paperDomain
                  .name
              }
            />
            <OrderItemProperty
              label="제지사"
              content={
                data.data.targetStockGroupEvent.stockGroup.product.manufacturer
                  .name
              }
            />
            <OrderItemProperty
              label="지군"
              content={
                data.data.targetStockGroupEvent.stockGroup.product.paperGroup
                  .name
              }
            />
            <OrderItemProperty
              label="지종"
              content={
                data.data.targetStockGroupEvent.stockGroup.product.paperType
                  .name
              }
            />
          </div>
        )}
        <div className="flex-[0_0_1px] bg-gray-300" />
        <div className="flex-[1_0_0px] flex flex-col bg-slate-200 h-0">
          {data.data && (
            <TaskMap
              plan={data.data}
              packagingType={
                data.data.targetStockGroupEvent.stockGroup.packaging.type
              }
            />
          )}
        </div>
        <div className="flex-[0_0_1px] bg-gray-300" />
        <div className="flex-initial basis-48 flex flex-col">
          <div className="flex-initial font-bold px-4 py-3 text-base">
            실투입 목록
          </div>
        </div>
      </div>
    </Popup.Template.Full>
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
