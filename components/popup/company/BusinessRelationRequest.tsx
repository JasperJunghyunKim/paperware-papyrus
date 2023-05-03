import { Api, Util } from "@/common";
import { Record } from "@/common/protocol";
import { Popup, Table, Toolbar } from "@/components";
import { useCallback, useEffect, useState } from "react";

export interface Props {
  open: boolean;
  onClose: (unit: false) => void;
}

export default function Component(props: Props) {
  const [data, page, setPage] = Api.Static.Company.useGetCompanyList({});
  const [selected, setSelected] = useState<Record.Company[]>([]);
  const only = Util.only(selected);

  const apiSendRequest =
    Api.External.BusinessRelationship.useSendBusinessRelationshipRequest();
  const cmdSendRequest = useCallback(
    async (
      values: Api.External.BusinessRelationship.SendBusinessRelationshipRequest
    ) => {
      await apiSendRequest.mutateAsync({ data: values });
      props.onClose(false);
    },
    [apiSendRequest, props]
  );

  useEffect(() => {
    if (!props.open) {
      setSelected([]);
    }
  }, [props.open]);

  return (
    <Popup.Template.Property
      title="매입처 등록"
      width={"800px"}
      height="500px"
      {...props}
      open={!!props.open}
    >
      <div className="flex-1 p-4 flex flex-col gap-4">
        <div className="flex-initial flex flex-row gap-2 justify-between">
          <Toolbar.Container></Toolbar.Container>
          <Toolbar.Container>
            <Toolbar.ButtonPreset.Continue
              label="매입처 등록 요청"
              onClick={async () => {
                only &&
                  (await cmdSendRequest({
                    dstCompanyId: only.id,
                  }));
              }}
              disabled={!only}
            />
          </Toolbar.Container>
        </div>
        <div className="flex-1">
          <Table.Default<Record.Company>
            data={data.data}
            page={page}
            setPage={setPage}
            keySelector={(record) => record.id}
            selected={selected}
            onSelectedChange={setSelected}
            selection="single"
            columns={[
              {
                title: "상호명",
                dataIndex: "businessName",
              },
              {
                title: "대표 전화",
                dataIndex: "phoneNo",
              },
              {
                title: "팩스",
                dataIndex: "faxNo",
              },
              {
                title: "이메일",
                dataIndex: "email",
              },
            ]}
          />
        </div>
      </div>
    </Popup.Template.Property>
  );
}
