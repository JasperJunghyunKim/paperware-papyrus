import { ApiHook, Util } from "@/common";
import { Record } from "@/common/protocol";
import { Select } from "antd";
import classNames from "classnames";
import { useMemo } from "react";

type RecordType = Record.BusinessRelationship;

interface Props {
  value?: number;
  onChange?: (value: number) => void;
  disabled?: boolean;
}

export default function Component(props: Props) {
  const list = ApiHook.Inhouse.BusinessRelationship.useGetList({
    query: {},
  });

  const options = useMemo(() => {
    return list.data?.items.map((x) => ({
      label: <Item item={x} />,
      text: `${x.dstCompany.businessName} ${x.dstCompany.phoneNo}`,
      value: x.dstCompany.id,
    }));
  }, [list]);

  console.log(options);

  return (
    <div className="flex flex-col gap-y-1">
      <Select
        value={props.value}
        onChange={props.onChange}
        options={options}
        filterOption={(input, option) => {
          if (!option) {
            return false;
          }
          return option.text.toLowerCase().includes(input.toLowerCase());
        }}
        showSearch
        allowClear
        placeholder="매출처 선택"
        disabled={props.disabled}
      />
    </div>
  );
}

interface ItemProps {
  item: RecordType;
}

function Item(props: ItemProps) {
  const x = props.item;
  return (
    <div className="flex font-fixed gap-x-4">
      <div className="flex-initial whitespace-pre">
        {x.dstCompany.businessName}
      </div>
      <div className="flex-1 text-gray-400 text-right font-fixed">
        {x.dstCompany.phoneNo}
      </div>
      <div
        className={classNames("flex-basis whitespace-pre font-fixed", {
          "text-gray-400": x.dstCompany.managedById === null,
          "text-purple-600": x.dstCompany.managedById !== null,
        })}
      >
        {x.dstCompany.managedById !== null ? "가상" : "관리"}
      </div>
    </div>
  );
}
