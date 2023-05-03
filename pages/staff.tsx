import { Toolbar } from "@/components";
import { Page } from "@/components/layout";
import { Table } from "antd";

export default function Component() {
  return (
    <Page title="직원 설정">
      <Toolbar.Container>
        <Toolbar.ButtonPreset.Create label="직원 추가" />
        <div className="flex-1" />
        <Toolbar.ButtonPreset.Update label="선택 직원 수정" />
        <Toolbar.ButtonPreset.Delete label="선택 직원 삭제" />
      </Toolbar.Container>
      <Table
        bordered
        pagination={{
          position: ["bottomCenter"],
          size: "default",
          pageSize: 100,
        }}
        scroll={{ x: true }}
        size="small"
        columns={[
          {
            title: "계정",
            dataIndex: "username",
            render: (value) => <div className="font-fixed">{value}</div>,
          },
          {
            title: "이름",
            dataIndex: "name",
          },
          {
            title: "이메일",
            dataIndex: "email",
          },
        ]}
        dataSource={[
          {
            username: "test",
            name: "테스터",
            email: null,
          },
        ]}
      />
    </Page>
  );
}
