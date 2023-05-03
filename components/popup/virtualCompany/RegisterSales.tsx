import { Api, Util } from "@/common";
import { Record } from "@/common/protocol";
import { Popup, Table, Toolbar } from "@/components";
import { useCallback, useEffect, useState } from "react";
import { Create } from ".";

export interface Props {
  open: boolean;
  onClose: (unit: false) => void;
}

export default function Component(props: Props) {
  const [data, page, setPage] =
    Api.Internal.VirtualCompany.useGetVirtualCompanyList({});

  const [selected, setSelected] = useState<Record.Company[]>([]);
  const [openCreate, setOpenCreate] = useState(false);

  const only = Util.only(selected);

  const apiCreate =
    Api.Internal.BusinessRelationship.useCreateBusinessRelationship();
  const cmdCreate = useCallback(
    async (
      values: Api.Internal.BusinessRelationship.CreateBusinessRelationship
    ) => {
      await apiCreate.mutateAsync({ data: values });
      props.onClose(false);
    },
    [apiCreate, props]
  );

  useEffect(() => {
    if (!props.open) {
      setSelected([]);
    }
  }, [props.open]);

  return (
    <Popup.Template.Property
      title="가상 매출처 등록"
      width={"800px"}
      height="500px"
      {...props}
      open={!!props.open}
    >
      <div className="flex-1 p-4 flex flex-col gap-4">
        <div className="flex-initial flex flex-row gap-2 justify-between">
          <Toolbar.Container>
            <Toolbar.ButtonPreset.Create
              label="가상 거래처 추가"
              onClick={() => setOpenCreate(true)}
            />
          </Toolbar.Container>
          <Toolbar.Container>
            {only && (
              <Toolbar.ButtonPreset.Continue
                label="매출처로 등록"
                onClick={async () => {
                  await cmdCreate({
                    dstCompanyId: only.id,
                  });
                }}
              />
            )}
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
                title: "가상 거래처 이름",
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
      <Create open={openCreate} onClose={() => setOpenCreate(false)} />
    </Popup.Template.Property>
  );
}
