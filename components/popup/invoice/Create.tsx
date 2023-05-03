import { Api, Util } from "@/common";
import { Record } from "@/common/protocol";
import { Icon, Popup, Table, Toolbar } from "@/components";
import { useCallback, useState } from "react";

export interface Props {
  open: number | false;
  onClose: (unit: false) => void;
}

export default function Component(props: Props) {
  const [release, page, setPage] = Api.Internal.StockOutput.useGetStockList({});
  const [selected, setSelected] = useState<Record.StockEvent[]>([]);
  const only = Util.only(selected);

  const api = Api.Internal.Invoice.useCreateItem();
  const cmd = useCallback(async () => {
    if (
      !props.open ||
      !only ||
      !(await Util.confirm("송장을 추가하시겠습니까?"))
    ) {
      return;
    }

    await api.mutateAsync({
      data: {
        shippingId: props.open,
        stockEventId: only.id,
      },
    });
    props.onClose(false);
  }, [api, only, props]);

  return (
    <Popup.Template.Full
      title="송장 추가"
      {...props}
      open={!!props.open}
      width="calc(100vw - 200px)"
      height="500px"
    >
      <div className="flex-1 p-4 flex flex-col gap-y-4">
        <div className="flex-initial">
          <Toolbar.Container>
            <div className="flex-1" />
            <Toolbar.ButtonPreset.Continue
              label="송장 추가"
              onClick={cmd}
              disabled={!only}
              tooltip="선택한 출고 재고의 송장 정보를 추가합니다."
            />
          </Toolbar.Container>
        </div>
        <div className="flex-1">
          <Table.Default
            data={release.data}
            page={page}
            setPage={setPage}
            columns={[
              {
                title: "재고 번호",
                dataIndex: ["stock", "serial"],
                render: (value) => <div className="font-fixed">{value}</div>,
              },
              {
                title: "포장",
                dataIndex: ["stock", "packaging", "type"],
                render: (value, record) => (
                  <div className="font-fixed flex gap-x-1">
                    <div className="flex-initial flex flex-col justify-center text-lg">
                      <Icon.PackagingType
                        packagingType={record.stock.packaging.type}
                      />
                    </div>
                    <div className="flex-initial flex flex-col justify-center">
                      {value}
                    </div>
                  </div>
                ),
              },
              {
                title: "수량",
                dataIndex: ["stock", "cachedQuantityAvailable"],
                render: (value, record) => (
                  <div className="font-fixed text-right whitespace-pre">
                    {record.stock.packaging.type === "ROLL"
                      ? `${Util.comma(Util.gramsToTon(value ?? 0), 3)} t `
                      : `${value} 매`}
                  </div>
                ),
              },
              {
                title: "제품유형",
                dataIndex: ["stock", "product", "paperDomain", "name"],
              },
              {
                title: "제지사",
                dataIndex: ["stock", "product", "manufacturer", "name"],
              },
              {
                title: "지군",
                dataIndex: ["stock", "product", "paperGroup", "name"],
              },
              {
                title: "지종",
                dataIndex: ["stock", "product", "paperType", "name"],
              },
              {
                title: "색군",
                dataIndex: ["stock", "paperColorGroup", "name"],
              },
              {
                title: "색상",
                dataIndex: ["stock", "paperColor", "name"],
              },
              {
                title: "무늬",
                dataIndex: ["stock", "paperPattern", "name"],
              },
              {
                title: "인증",
                dataIndex: ["stock", "paperCert", "name"],
              },
            ]}
            keySelector={(item) => item.id}
            selection="single"
            selected={selected}
            onSelectedChange={setSelected}
          />
        </div>
      </div>
    </Popup.Template.Full>
  );
}
