import { Api, Util } from "@/common";
import { Record } from "@/common/protocol";
import { Popup, StatBar, Table, Toolbar } from "@/components";
import { Page } from "@/components/layout";
import classNames from "classnames";
import { useCallback, useState } from "react";
import {
  TbCircleDotted,
  TbCircleFilled,
  TbCircleHalf2,
  TbCircleMinus,
  TbClipboardList,
  TbForbid,
  TbHomeLink,
} from "react-icons/tb";

export default function Component() {
  const [openCreate, setOpenCreate] = useState(false);
  const [openUpdate, setOpenUpdate] = useState<number | false>(false);

  const stats = Api.External.Order.useGetOrderStats();
  const [data, page, setPage] = Api.External.Order.useGetOrderList({});
  const [selected, setSelected] = useState<Record.Order[]>([]);
  const only = Util.only(selected);

  const apiDelete = Api.External.Order.useOrderCancel(only?.id ?? null);
  const cmdDelete = useCallback(async () => {
    if (!only || !(await Util.confirm("작성중인 주문을 삭제하시겠습니까?"))) {
      return;
    }

    await apiDelete.mutateAsync({ data: { id: only.id } });
    setSelected([]);
  }, [only, apiDelete]);

  const apiContinue = Api.External.Order.useOrderRequest(only?.id ?? null);
  const cmdContinue = useCallback(async () => {
    if (
      !only ||
      !(await Util.confirm("선택한 주문으로 발주 진행하시겠습니까?"))
    ) {
      return;
    }

    await apiContinue.mutateAsync({
      data: {
        id: only.id,
      },
    });
    setSelected([]);
  }, [only, apiContinue]);

  const apiRecover = Api.External.Order.useOrderRecover(only?.id ?? null);
  const cmdRecover = useCallback(async () => {
    if (!only || !(await Util.confirm("선택한 주문을 재입력하시겠습니까?"))) {
      return;
    }

    await apiRecover.mutateAsync({
      data: {
        id: only.id,
      },
    });
    setSelected([]);
  }, [only, apiRecover]);

  return (
    <Page title="매입 주문 목록">
      <StatBar.Container>
        <StatBar.Item
          icon={<TbClipboardList />}
          label="작성중"
          value={`${Util.comma(stats.data?.preparingCount)}`}
        />
      </StatBar.Container>
      <Toolbar.Container>
        <Toolbar.ButtonPreset.Create
          label="새 주문 등록"
          onClick={() => setOpenCreate(true)}
        />
        <div className="flex-1" />
        {only && Util.inc(only.status, "PREPARING") && (
          <>
            <Toolbar.ButtonPreset.Send
              label="발주 진행"
              onClick={cmdContinue}
            />
            <Toolbar.ButtonPreset.Delete
              label="주문 삭제"
              onClick={cmdDelete}
            />
          </>
        )}
        {only && Util.inc(only.status, "REJECTED") && (
          <>
            <Toolbar.ButtonPreset.Continue
              label="주문 재입력"
              onClick={cmdRecover}
            />
            <Toolbar.ButtonPreset.Delete
              label="주문 삭제"
              onClick={cmdDelete}
            />
          </>
        )}
        {only && !Util.inc(only.status, "REJECTED") && (
          <Toolbar.ButtonPreset.Update
            label="주문 상세"
            disabled={!only}
            onClick={() => {
              if (only) {
                setOpenUpdate(only.id);
              }
            }}
          />
        )}
      </Toolbar.Container>
      <Table.Default<Record.Order>
        data={data.data}
        page={page}
        setPage={setPage}
        keySelector={(record) => record.id}
        selected={selected}
        onSelectedChange={setSelected}
        columns={[
          {
            title: "주문 번호",
            dataIndex: "orderNo",
            render: (value) => <div className="font-fixed">{value}</div>,
          },
          {
            title: "매입처",
            dataIndex: ["dstCompany", "businessName"],
          },
          {
            title: "가상 매입처 여부",
            dataIndex: ["dstCompany", "managedById"],
            render: (value) =>
              value && (
                <div className="flex flex-row gap-2 text-purple-800">
                  <div className="flex flex-col justify-center">
                    <TbHomeLink className="text-lg" />
                  </div>
                  <div className="flex flex-col justify-center">
                    가상 매입처
                  </div>
                </div>
              ),
          },
          {
            title: "주문 상태",
            dataIndex: "status",
            render: (value: Record.OrderStatus) => (
              <div
                className={classNames("flex gap-x-1 font-fixed", {
                  "text-gray-800": value === "PREPARING",
                  "text-gray-400": value === "CANCELLED",
                  "text-yellow-600":
                    value === "ESTIMATE" || value === "REQUESTED",
                  "text-blue-600": value === "ACCEPTED",
                  "text-red-500": value === "REJECTED",
                })}
              >
                <div className="flex-initial flex flex-col justify-center">
                  {value === "PREPARING" && <TbCircleDotted />}
                  {value === "CANCELLED" && <TbForbid />}
                  {value === "ESTIMATE" && <TbCircleHalf2 />}
                  {value === "REQUESTED" && <TbCircleHalf2 />}
                  {value === "ACCEPTED" && <TbCircleFilled />}
                  {value === "REJECTED" && <TbCircleMinus />}
                </div>
                <div className="flex-initial flex flex-col justify-center">
                  {Util.orderStatusToString(value)}
                </div>
              </div>
            ),
          },
          {
            title: "마감 희망일",
            dataIndex: "wantedDate",
            render: (value) => (
              <div className="font-fixed">
                {Util.formatIso8601ToLocalDate(value)}
              </div>
            ),
          },
        ]}
        expandable={{}}
      />
      <Popup.Order.Create open={openCreate} onClose={setOpenCreate} />
      <Popup.Order.Update open={openUpdate} onClose={setOpenUpdate} />
    </Page>
  );
}

interface InnerProps {
  order: Record.Order;
}

function Inner(props: InnerProps) {}
