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
import {
  TbCheck,
  TbCirclePlus,
  TbPencil,
  TbLock,
  TbLockOff,
  TbCircleCheck,
  TbQuestionMark,
} from "react-icons/tb";
import { match } from "ts-pattern";
import * as R from "@/lib/util/rules";
import classNames from "classnames";
import { Company } from "@/app/api/company/route";
import { UpdateCompanyBody } from "@/app/api/company/[id]/route";

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
  const [openActivate, setOpenActivate] = useState<
    { id: number; isActivated: boolean } | false
  >(false);
  const [openDelete, setOpenDelete] = useState<number | false>(false);

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
            render: (record) => (
              <div className="px-2 flex gap-x-2">
                <div
                  className={classNames("flex-initial", {
                    "line-through": record.isDeleted,
                  })}
                >
                  {record.businessName}
                </div>
                <div className="flex-initial">
                  {record.isDeleted && (
                    <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10 flex-nowrap whitespace-nowrap">
                      탈퇴
                    </span>
                  )}
                </div>
              </div>
            ),
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
            title: "관리자 ID",
            key: "admin.username",
            render: (record: Company) => (
              <div className="px-2 d2coding">{record.user.at(0)?.username}</div>
            ),
          },
          {
            title: "관리자명",
            key: "admin.name",
            render: (record: Company) => (
              <div className="px-2">{record.user.at(0)?.name}</div>
            ),
          },
          {
            title: "계정 수",
            key: "userCount",
            render: (record: Company) => (
              <div className="px-2 d2coding text-right">
                {record._count.user}
              </div>
            ),
          },
          {
            title: "PAPERWARE 활성 여부",
            key: "isActivated",
            render: (record: Company) => (
              <div className="flex justify-center text-2xl">
                {record.isActivated && !record.isDeleted && (
                  <TbCircleCheck className="text-green-700" />
                )}
              </div>
            ),
          },
          {
            title: "Popbill ID",
            key: "popbillId",
            dataIndex: "popbillId",
            render: (value) => <div className="px-2 d2coding">{value}</div>,
          },
          {
            width: "0px",
            render: (record) => (
              <div className="flex justify-center gap-x-1 p-1">
                <Button
                  text="수정"
                  disabled={record.isDeleted}
                  onClick={() => setOpenUpdate(record.id)}
                />
                <Button
                  text={record.isActivated ? "비활성화" : "활성화"}
                  disabled={record.isDeleted}
                  onClick={() =>
                    setOpenActivate({
                      id: record.id,
                      isActivated: record.isActivated,
                    })
                  }
                />
                <Button
                  text="탈퇴"
                  color="red"
                  disabled={record.isDeleted}
                  onClick={() => setOpenDelete(record.id)}
                />
              </div>
            ),
          },
        ]}
      />
      <PopupCreate open={openCreate} onClose={setOpenCreate} />
      <PopupUpdate open={openUpdate} onClose={setOpenUpdate} />
      <PopupActivate open={openActivate} onClose={setOpenActivate} />
      <PopupDelete open={openDelete} onClose={setOpenDelete} />
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
          rules={[R.required(), R.lengthExact(10)]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="businessName" label="상호" rules={[R.required()]}>
          <Input />
        </Form.Item>
        <Form.Item
          name="companyType"
          label="고객사 구분"
          rules={[R.required()]}
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
        <Form.Item
          name="corporateRegistrationNumber"
          label="법인등록번호"
          rules={[R.lengthExact(13)]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="representative" label="대표자" rules={[R.required()]}>
          <Input />
        </Form.Item>
        <Form.Item
          name="phoneNo"
          label="전화번호"
          rules={[R.required(), R.phone()]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="faxNo" label="팩스번호">
          <Input />
        </Form.Item>
        <Form.Item name="address" label="주소" rules={[R.required()]}>
          <Control.Address />
        </Form.Item>
        <Form.Item name="bizType" label="업종" rules={[R.required()]}>
          <Input />
        </Form.Item>
        <Form.Item name="bizItem" label="업태" rules={[R.required()]}>
          <Input />
        </Form.Item>
        <Form.Item
          name="invoiceCode"
          label="회사코드"
          rules={[R.required(), R.lengthExact(4)]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="startDate" label="설립일자" rules={[R.required()]}>
          <Control.DatePicker />
        </Form.Item>
        <Form.Item name="memo" label="비고" rules={[R.length(0, 200)]}>
          <Input.TextArea rows={2} />
        </Form.Item>
        <div className="bg-gray-100 border-l-4 border-black font-bold p-2 mb-4">
          관리자 계정 정보
        </div>
        <Form.Item name={["admin", "name"]} label="이름" rules={[R.required()]}>
          <Input />
        </Form.Item>
        <Form.Item
          name={["admin", "username"]}
          label="아이디"
          rules={[R.required()]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name={["admin", "password"]}
          label="비밀번호"
          rules={[R.required(), R.password()]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name={["admin", "phoneNo"]}
          label="전화번호"
          rules={[R.required(), R.phone()]}
        >
          <Input />
        </Form.Item>
        <Form.Item name={["admin", "email"]} label="이메일" rules={[R.email()]}>
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
  const [form] = useForm<UpdateCompanyBody>();

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
      form.setFieldsValue({
        ...data.data,
        admin: {
          password: undefined,
        },
      });
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
        <Form.Item label="사업자등록번호">
          <Input disabled value={data.data?.companyRegistrationNumber} />
        </Form.Item>
        <Form.Item name="businessName" label="상호" rules={[R.required()]}>
          <Input />
        </Form.Item>
        <Form.Item
          name="companyType"
          label="고객사 구분"
          rules={[R.required()]}
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
        <Form.Item
          name="corporateRegistrationNumber"
          label="법인등록번호"
          rules={[R.lengthExact(13)]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="representative" label="대표자" rules={[R.required()]}>
          <Input />
        </Form.Item>
        <Form.Item
          name="phoneNo"
          label="전화번호"
          rules={[R.required(), R.phone()]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="faxNo" label="팩스번호">
          <Input />
        </Form.Item>
        <Form.Item name="address" label="주소" rules={[R.required()]}>
          <Control.Address />
        </Form.Item>
        <Form.Item name="bizType" label="업종" rules={[R.required()]}>
          <Input />
        </Form.Item>
        <Form.Item name="bizItem" label="업태" rules={[R.required()]}>
          <Input />
        </Form.Item>
        <Form.Item label="회사코드">
          <Input disabled value={data.data?.invoiceCode} />
        </Form.Item>
        <Form.Item name="startDate" label="설립일자" rules={[R.required()]}>
          <Control.DatePicker />
        </Form.Item>
        <Form.Item name="memo" label="비고" rules={[R.length(0, 200)]}>
          <Input.TextArea rows={2} />
        </Form.Item>
        <div className="bg-gray-100 border-l-4 border-black font-bold p-2 mb-4">
          관리자 계정 정보
        </div>
        <Form.Item label="이름">
          <Input disabled value={data.data?.user.at(0)?.name} />
        </Form.Item>
        <Form.Item label="아이디">
          <Input disabled value={data.data?.user.at(0)?.username} />
        </Form.Item>
        <Form.Item
          name={["admin", "password"]}
          label="비밀번호 변경"
          rules={[R.password()]}
        >
          <Input placeholder="비밀번호를 변경하려면 입력하세요." />
        </Form.Item>
        <Form.Item label="전화번호">
          <Input
            disabled
            value={Formatter.formatPhoneNo(data.data?.user.at(0)?.phoneNo)}
          />
        </Form.Item>
        <Form.Item label="이메일">
          <Input disabled value={data.data?.user.at(0)?.email} />
        </Form.Item>
      </Form>
    </Popup>
  );
}

function PopupActivate(props: {
  open: { id: number; isActivated: boolean } | false;
  onClose: (unit: false) => void;
}) {
  const open = props.open as { id: number; isActivated: boolean };

  const api = Queries.Company.useSetActivate();
  const act = useCallback(async () => {
    if (!open) return;
    await api.mutateAsync({
      id: open.id,
      data: { isActivated: !open.isActivated },
    });
    props.onClose(false);
  }, [props.onClose, props.open]);

  return (
    <Popup
      {...props}
      title={"확인"}
      icon={<TbQuestionMark />}
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
          <Button text="확인" icon={<TbCheck />} onClick={act} />
        </div>
      }
    >
      <div className="p-4">
        {open.isActivated
          ? "선택한 고객사를 비활성화 하시겠습니까?"
          : "선택한 고객사를 활성화 하시겠습니까?"}
      </div>
    </Popup>
  );
}

function PopupDelete(props: {
  open: number | false;
  onClose: (unit: false) => void;
}) {
  const api = Queries.Company.useDeleteCompany();
  const action = useCallback(async () => {
    if (!props.open) return;
    await api.mutateAsync({ id: props.open });
    props.onClose(false);
  }, [api, props.onClose, props.open]);

  return (
    <Popup
      {...props}
      title="확인"
      icon={<TbQuestionMark />}
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
      <div className="p-4">영구적으로 탈퇴처리됩니다. 계속하시겠습니까?</div>
    </Popup>
  );
}
