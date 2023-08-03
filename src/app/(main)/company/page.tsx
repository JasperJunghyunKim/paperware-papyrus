"use client";

import { Control } from "@/components";
import { Button, Popup, Search } from "@/components/control";
import { Page } from "@/components/layout";
import { Queries } from "@/lib";
import { Formatter } from "@/lib/util";
import { CompanyType } from "@prisma/client";
import { Form, Input, Radio, Select, Table } from "antd";
import { useForm } from "antd/lib/form/Form";
import { useCallback, useEffect, useMemo, useState } from "react";
import { TbCheck, TbCirclePlus, TbPencil, TbLock, TbLockOff } from "react-icons/tb";
import { match } from "ts-pattern";

const toOptions = (items: { id: number; name: string }[]) => {
  return items.map((p) => ({ value: p.id, label: p.name }));
};

export default function Component() {
  const [skip, setSkip] = useState(0);
  const [take, setTake] = useState(10);
  const [search, setSearch] = useState<Record<string, string>>({});

  const data = Queries.Company.useGetCompanyList({
    skip,
    take,
    ...search,
  });

  const [openCreate, setOpenCreate] = useState(false);
  const [openUpdate, setOpenUpdate] = useState<number | false>(false);
  const [openActivate, setOpenActivate] = useState<{ id: number; isActivated: boolean } | false>(false);

  return (
    <Page
      title={`고객사 관리 (${data.data?.total ?? ""})`}
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
              name: "invoiceCode",
              label: "회사코드",
            },
            {
              type: "text",
              name: "businessName",
              label: "상호",
            },
            {
              type: "text",
              name: "companyRegistrationNumber",
              label: "사업자등록번호",
            },
            {
              type: "text",
              name: "representative",
              label: "대표자",
            },
            {
              type: "text",
              name: "bizType",
              label: "업종",
            },
            {
              type: "text",
              name: "bizItem",
              label: "업태",
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
            title: "고객사 구분",
            key: "companyType",
            dataIndex: "companyType",
            render: (value) => (
              <div className="px-2">
                {match(value)
                  .with(CompanyType.DISTRIBUTOR, () => "유통사")
                  .with(CompanyType.MANUFACTURER, () => "제지사")
                  .with(CompanyType.PRACTICAL, () => "실수요")
                  .with(CompanyType.ETC, () => "기타")
                  .otherwise(() => "")}
              </div>
            ),
          },
          {
            title: "상호",
            render: (record) => (<div className="px-2">
              {record.businessName} 
              {record.isDeleted && 
                (<span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">
                  탈퇴
                </span>)
              }
            </div>),
          },
          {
            title: "사업자등록번호",
            key: "companyRegistrationNumber",
            dataIndex: "companyRegistrationNumber",
            render: (value) => (
              <div className="px-2 d2coding">
                {Formatter.formatCompanyRegistrationNo(value)}
              </div>
            ),
          },
          {
            title: "법인등록번호",
            key: "corporateRegistrationNumber",
            dataIndex: "corporateRegistrationNumber",
            render: (value) => (
              <div className="px-2 d2coding">
                {Formatter.formatCorporateRegistrationNo(value)}
              </div>
            ),
          },
          {
            title: "대표자",
            key: "representative",
            dataIndex: "representative",
            render: (value) => <div className="px-2">{value}</div>,
          },
          {
            title: "회사코드",
            key: "invoiceCode",
            dataIndex: "invoiceCode",
            render: (value) => <div className="px-2 d2coding">{value}</div>,
          },
          {
            title: "전화",
            key: "phoneNo",
            dataIndex: "phoneNo",
            render: (value) => (
              <div className="px-2 d2coding">
                {Formatter.formatPhoneNo(value)}
              </div>
            ),
          },
          {
            title: "팩스",
            key: "faxNo",
            dataIndex: "faxNo",
            render: (value) => (
              <div className="px-2 d2coding">
                {Formatter.formatPhoneNo(value)}
              </div>
            ),
          },
          {
            title: "주소",
            key: "address",
            dataIndex: "address",
            render: (value) => (
              <div className="px-2">{Formatter.formatAddress(value)}</div>
            ),
          },
          {
            title: "Popbill ID",
            key: "popbillId",
            dataIndex: "popbillId",
            render: (value) => <div className="px-2">{value}</div>,
          },
          {
            width: "0px",
            render: (record) => (
              <div className="flex justify-center gap-x-2 p-1">
                <Button text="수정" disabled={record.isDeleted} onClick={() => setOpenUpdate(record.id)} />
              </div>
            ),
          },
          {
            width: "0px",
            render: (record) => (
              <div className="flex justify-center gap-x-2 p-1">
                  <Button text={record.isActivated ? '비활성화' : '활성화'} disabled={record.isDeleted} onClick={() => setOpenActivate({id: record.id, isActivated: record.isActivated})} />
                </div>
            ),
          },
          {
            width: "0px",
            render: (record) => (
              <div className="flex justify-center gap-x-2 p-1">
                  <Button text="탈퇴" disabled={record.isDeleted} onClick={() => console.log('탈퇴')} />
                </div>
            ),
          },
        ]}
      />
      <PopupCreate open={openCreate} onClose={setOpenCreate} />
      <PopupUpdate open={openUpdate} onClose={setOpenUpdate} />
      <PopupActivate open={openActivate} onClose={setOpenActivate} />
    </Page>
  );
}

function PopupCreate(props: { open: boolean; onClose: (unit: false) => void }) {
  const [form] = useForm();

  const api = Queries.Company.useCreateCompany();
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
      height="calc(100vh - 200px)"
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
      <Form
        form={form}
        layout="vertical"
        rootClassName="w-full h-full p-4 overflow-y-scroll"
      >
        <div className="bg-gray-100 border-l-4 border-black font-bold p-2 mb-4">
          고객사 정보
        </div>
        <Form.Item
          name="companyRegistrationNumber"
          label="사업자등록번호"
          rules={[
            {
              required: true,
              message: "사업자등록번호를 입력해주세요.",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="businessName"
          label="상호"
          rules={[
            {
              required: true,
              message: "상호를 입력해주세요.",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="companyType"
          label="고객사 구분"
          rules={[
            {
              required: true,
              message: "고객사 구분을 선택해주세요.",
            },
          ]}
        >
          <Radio.Group
            optionType="button"
            buttonStyle="solid"
            options={[
              {
                value: "DISTRIBUTOR",
                label: "유통사",
              },
              {
                value: "MANUFACTURER",
                label: "제지사",
              },
              {
                value: "PRACTICAL",
                label: "실수요",
              },
              {
                value: "ETC",
                label: "기타",
              },
            ]}
          />
        </Form.Item>
        <Form.Item name="corporateRegistrationNumber" label="법인등록번호">
          <Input />
        </Form.Item>
        <Form.Item
          name="representative"
          label="대표자"
          rules={[
            {
              required: true,
              message: "대표자를 입력해주세요.",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="phoneNo"
          label="전화번호"
          rules={[
            {
              required: true,
              message: "전화번호를 입력해주세요.",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="faxNo" label="팩스번호">
          <Input />
        </Form.Item>
        <Form.Item
          name="address"
          label="주소"
          rules={[
            {
              required: true,
              message: "주소를 입력해주세요.",
            },
          ]}
        >
          <Control.Address />
        </Form.Item>
        <Form.Item
          name="bizType"
          label="업종"
          rules={[
            {
              required: true,
              message: "업종을 입력해주세요.",
            },
          ]}
        >
          <Select
            options={toOptions([
              { id: 1, name: "제조업" },
              { id: 2, name: "도소매업" },
              { id: 3, name: "서비스업" },
              { id: 4, name: "기타" },
            ])}
          />
        </Form.Item>
        <Form.Item
          name="bizItem"
          label="업태"
          rules={[
            {
              required: true,
              message: "업태를 입력해주세요.",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="invoiceCode"
          label="회사코드"
          rules={[
            {
              required: true,
              message: "회사코드를 입력해주세요.",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="startDate"
          label="설립일자"
          rules={[
            {
              required: true,
              message: "설립일자를 입력해주세요.",
            },
          ]}
        >
          <Control.DatePicker />
        </Form.Item>
        <Form.Item name="memo" label="비고">
          <Input.TextArea rows={2} />
        </Form.Item>
        <div className="bg-gray-100 border-l-4 border-black font-bold p-2 mb-4">
          관리자 계정 정보
        </div>
        <Form.Item
          name={["user", "name"]}
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
        <Form.Item
          name={["user", "username"]}
          label="아이디"
          rules={[
            {
              required: true,
              message: "아이디를 입력해주세요.",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name={["user", "password"]}
          label="비밀번호"
          rules={[
            {
              required: true,
              message: "비밀번호를 입력해주세요.",
            },
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          name={["user", "checkPassword"]}
          label="비밀번호 확인"
          rules={[
            {
              required: true,
              message: "비밀번호 확인을 입력해주세요.",
            },
            {
              validator: async (_, value) => {
                if (value !== form.getFieldValue(["user", "password"])) {
                  throw new Error("비밀번호가 일치하지 않습니다.");
                }
              },
            },
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          name={["user", "phoneNo"]}
          label="전화번호"
          rules={[
            {
              required: true,
              message: "전화번호를 입력해주세요.",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item name={["user", "email"]} label="이메일">
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

  const data = Queries.Company.useGetCompanyItem({
    id: props.open ? props.open : undefined,
  });

  const api = Queries.Company.useUpdateCompany();
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
        <Form.Item
          name="businessName"
          label="상호"
          rules={[
            {
              required: true,
              message: "상호를 입력해주세요.",
            },
          ]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Popup>
  );
}

function PopupActivate(props: {
  open: { id: number; isActivated: boolean; } | false;
  onClose: (unit: false) => void;
}) {
  const open = props.open as { id: number; isActivated: boolean; };

  const action = useCallback(async () => {
    if (!props.open) return;
    console.log("비활성화")
    props.onClose(false);
  }, [props.onClose, props.open]);

  return (
    <Popup
      {...props}
      title={open.isActivated ? '비활성화 하시겠습니까?' : '활성화 하시겠습니까?'}
      icon={open.isActivated ? <TbLock /> : <TbLockOff />}
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
          <Button text="확인" icon={<TbCheck />} onClick={action} />
        </div>
      }
    >
    </Popup>
  );
}