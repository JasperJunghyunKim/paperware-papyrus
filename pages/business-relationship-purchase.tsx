import { Api, Util } from "@/common";
import { Record } from "@/common/protocol";
import { Popup, StatBar, Table, Toolbar } from "@/components";
import { Page } from "@/components/layout";
import { useState } from "react";
import { TbHome2, TbHomeLink } from "react-icons/tb";

type RecordType = Record.BusinessRelationship;

export default function Component() {
  const [openRequest, setOpenRequest] = useState(false);
  const [openVirtual, setOpenVirtual] = useState(false);

  const stats =
    Api.Internal.BusinessRelationship.useGetBusinessRelationshipPurchaseStats();
  const [data, page, setPage] =
    Api.Internal.BusinessRelationship.useGetBusinessRelationshipPurchaseList(
      {}
    );
  const [selected, setSelected] = useState<RecordType[]>([]);

  return (
    <Page title="매입처 관리">
      <StatBar.Container>
        <StatBar.Item
          icon={<TbHome2 />}
          label="관리 매입처"
          value={Util.comma(stats.data?.count ?? 0)}
        />
        <StatBar.Item
          icon={<TbHomeLink />}
          label="가상 매입처"
          value={Util.comma(stats.data?.virtualCount ?? 0)}
          iconClassName="text-purple-800"
        />
      </StatBar.Container>
      <Toolbar.Container>
        <Toolbar.ButtonPreset.Create
          label="관리 매입처 등록"
          onClick={() => setOpenRequest(true)}
        />
        <Toolbar.Button
          icon={<TbHomeLink />}
          label="가상 매입처 등록"
          onClick={() => setOpenVirtual(true)}
        />
      </Toolbar.Container>
      <Table.Default<RecordType>
        data={data.data}
        page={page}
        setPage={setPage}
        keySelector={(record) =>
          `${record.srcCompany.id}-${record.dstCompany.id}`
        }
        selected={selected}
        onSelectedChange={setSelected}
        columns={[
          {
            title: "매입처 이름",
            dataIndex: ["srcCompany", "businessName"],
          },
          {
            title: "대표 전화",
            dataIndex: ["srcCompany", "phoneNo"],
          },
          {
            title: "팩스",
            dataIndex: ["srcCompany", "faxNo"],
          },
          {
            title: "이메일",
            dataIndex: ["srcCompany", "email"],
          },
          {
            title: "가상 매입처 여부",
            dataIndex: ["srcCompany", "managedById"],
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
        ]}
      />
      <Popup.Company.BusinessRelationshipRequest
        open={openRequest}
        onClose={setOpenRequest}
      />
      <Popup.VirtualCompany.RegisterPurchase
        open={openVirtual}
        onClose={setOpenVirtual}
      />
    </Page>
  );
}
