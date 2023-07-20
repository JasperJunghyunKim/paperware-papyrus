"use client";

import { Button, Popup, Search } from "@/components/control";
import { Page } from "@/components/layout";
import { Queries } from "@/lib";
import { Form, Input, Radio, Table } from "antd";
import { useForm } from "antd/lib/form/Form";
import { useCallback, useEffect, useState } from "react";
import { TbCheck, TbCirclePlus, TbPencil } from "react-icons/tb";

export default function Component() {
  const [skip, setSkip] = useState(0);
  const [take, setTake] = useState(10);
  const [search, setSearch] = useState<Record<string, string>>({});

  const data = Queries.Metadata.useGetPaperColorGroupList({
    skip,
    take,
    ...search,
  });

  const [openCreate, setOpenCreate] = useState(false);
  const [openUpdate, setOpenUpdate] = useState<number | false>(false);

  return (
    <Page
      title={`색군 (${data.data?.total ?? ""})`}
      containerClassName="flex-1 flex flex-col gap-y-4"
    >
      <div className="flex-initial flex px-4 gap-x-2">
        <Button
          text="새 항목"
          icon={<TbCirclePlus />}
          onClick={() => setOpenCreate(true)}
        />
      </div>
      <div className="flex-initial px-4">
        <Search
          options={[
            {
              type: "text",
              name: "name",
              label: "이름",
            },
          ]}
          values={search}
          onSubmit={setSearch}
        />
      </div>
      <Table
        rootClassName="flex-1 px-4"
        dataSource={data.data?.items ?? []}
        bordered
        size="small"
        rowKey={(p) => p.id}
        pagination={{
          current: Math.floor(skip / take) + 1,
          pageSize: take,
          total: data.data?.total ?? 0,
          onChange: (page, size) => {
            setSkip((page - 1) * size);
            setTake(size);
          },
          showSizeChanger: true,
        }}
        columns={[
          {
            title: "이름",
            key: "name",
            dataIndex: "name",
            render: (value) => <div className="px-2">{value}</div>,
          },
          {
            title: "단종 여부",
            key: "isDiscontinued",
            dataIndex: "isDiscontinued",
            render: (value) => <div className="px-2">{value}</div>,
          },
          {
            title: "드롭다운 표시 여부",
            key: "isDeleted",
            dataIndex: "isDeleted",
            render: (value) => <div className="px-2">{value}</div>,
          },
          {
            width: "0px",
            render: (record) => (
              <div className="flex justify-center gap-x-2 p-1">
                <Button text="수정" onClick={() => setOpenUpdate(record.id)} />
              </div>
            ),
          },
        ]}
      />
      <PopupCreate open={openCreate} onClose={setOpenCreate} />
      <PopupUpdate open={openUpdate} onClose={setOpenUpdate} />
    </Page>
  );
}

function PopupCreate(props: { open: boolean; onClose: (unit: false) => void }) {
  const [form] = useForm();

  const api = Queries.Metadata.useCreatePaperColorGroup();
  const action = useCallback(async () => {
    const values = await form.validateFields();
    await api.mutateAsync({ data: values });
    props.onClose(false);
  }, [api, props.onClose]);

  useEffect(() => {
    form.resetFields();
  }, [props.open]);

  return (
    <Popup
      {...props}
      title="새 항목"
      icon={<TbCirclePlus />}
      width="500px"
      height="auto"
      footer={
        <div className="flex justify-center p-2 gap-x-2">
          <Button
            text="취소"
            color="white"
            onClick={() => props.onClose(false)}
          />
          <Button text="완료" icon={<TbCheck />} onClick={action} />
        </div>
      }
    >
      <Form form={form} layout="vertical" rootClassName="p-4">
        <Form.Item
          name="name"
          label="이름"
          rules={[
            {
              required: true,
              message: "이름을 입력해주세요.",
            },
          ]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Popup>
  );
}

function PopupUpdate(props: {
  open: number | false;
  onClose: (unit: false) => void;
}) {
  const [form] = useForm();

  const data = Queries.Metadata.useGetPaperColorGroupItem({
    id: props.open ? props.open : undefined,
  });

  const api = Queries.Metadata.useUpdatePaperColorGroup();
  const action = useCallback(async () => {
    if (!props.open) return;

    const values = await form.validateFields();
    await api.mutateAsync({ id: props.open, data: values });
    props.onClose(false);
  }, [api, props.onClose, props.open]);

  useEffect(() => {
    if (data.data) {
      form.setFieldsValue(data.data);
    } else {
      form.resetFields();
    }
  }, [data.data]);

  return (
    <Popup
      {...props}
      title="수정"
      icon={<TbPencil />}
      open={props.open !== false}
      width="500px"
      height="auto"
      footer={
        <div className="flex justify-center p-2 gap-x-2">
          <Button
            text="취소"
            color="white"
            onClick={() => props.onClose(false)}
          />
          <Button text="완료" icon={<TbCheck />} onClick={action} />
        </div>
      }
    >
      <Form form={form} layout="vertical" rootClassName="p-4">
        <Form.Item name="name" label="이름">
          <Input disabled />
        </Form.Item>
        <Form.Item
          name="isDiscontinued"
          label="단종 여부"
          rules={[
            {
              required: true,
              message: "단종 여부를 선택해주세요.",
            },
          ]}
        >
          <Radio.Group
            options={[
              { value: true, label: "예" },
              { value: false, label: "아니오" },
            ]}
          />
        </Form.Item>
        <Form.Item
          name="isDeleted"
          label="드롭다운 표시 여부"
          rules={[
            {
              required: true,
              message: "드롭다운 표시 여부를 선택해주세요.",
            },
          ]}
        >
          <Radio.Group
            options={[
              { value: true, label: "예" },
              { value: false, label: "아니오" },
            ]}
          />
        </Form.Item>
      </Form>
    </Popup>
  );
}
