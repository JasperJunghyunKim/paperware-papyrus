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
  const [data, page, setPage] = Api.External.Order.useGetReceivingOrderList({});
  const [selected, setSelected] = useState<Record.Order[]>([]);
  const only = Util.only(selected);

  const apiReject = Api.External.Order.useOrderReject(only?.id ?? null);
  const cmdReject = useCallback(async () => {
    if (!only || !(await Util.confirm("선택한 수주를 거절하시겠습니까?"))) {
      return;
    }

    await apiReject.mutateAsync({ data: { id: only.id } });
    setSelected([]);
  }, [only, apiReject]);

  const apiAccept = Api.External.Order.useOrderAccept(only?.id ?? null);
  const cmdAccept = useCallback(async () => {
    if (!only || !(await Util.confirm("선택한 수주를 승인하시겠습니까?"))) {
      return;
    }

    await apiAccept.mutateAsync({
      data: {
        id: only.id,
      },
    });
    setSelected([]);
  }, [only, apiAccept]);

  return (
    <Page title="매출 주문 목록">
      <StatBar.Container>
        <StatBar.Item
          icon={<TbClipboardList />}
          label="작성중"
          value={`${Util.comma(stats.data?.preparingCount)}`}
        />
      </StatBar.Container>
      <Toolbar.Container>
        <Toolbar.ButtonPreset.Create
          label="새 수주 등록"
          onClick={() => setOpenCreate(true)}
        />
        <div className="flex-1" />
        {only && (
          <>
            <Toolbar.ButtonPreset.Send
              label="수주 승인"
              disabled={!only || only.status !== "REQUESTED"}
              onClick={cmdAccept}
            />
            <Toolbar.ButtonPreset.Delete
              label="수주 거절"
              disabled={!only || only.status !== "REQUESTED"}
              onClick={cmdReject}
            />
          </>
        )}
        <Toolbar.ButtonPreset.Update
          label="수주 상세"
          disabled={!only}
          onClick={() => {
            if (only) {
              setOpenUpdate(only.id);
            }
          }}
        />
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
            title: "매출처",
            dataIndex: ["srcCompany", "businessName"],
          },
          {
            title: "가상 매출처 여부",
            dataIndex: ["srcCompany", "managedById"],
            render: (value) =>
              value && (
                <div className="flex flex-row gap-2 text-purple-800">
                  <div className="flex flex-col justify-center">
                    <TbHomeLink className="text-lg" />
                  </div>
                  <div className="flex flex-col justify-center">
                    가상 매출처
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
      <Popup.Order.CreateSales open={openCreate} onClose={setOpenCreate} />
      <Popup.Order.UpdateSales open={openUpdate} onClose={setOpenUpdate} />
    </Page>
  );
}

interface InnerProps {
  order: Record.Order;
}

function Inner(props: InnerProps) {}
