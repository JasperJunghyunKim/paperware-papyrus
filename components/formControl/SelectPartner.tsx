import { Model } from "@/@shared";
import { ApiHook } from "@/common";
import { Select } from "antd";
import { useMemo } from "react";

interface Props {
  value?: number;
  onChange?: (value: number) => void;
}

export default function Component(props: Props) {
  const staticData = ApiHook.Partner.Partner.useGetList();

  const options = useMemo(() => {
    const newItemList = staticData.data?.map((el) => ({
      label: <Item item={el} />,
      text: el.partnerNickName,
      value: el.partnerId,
    }));

    newItemList?.unshift({
      label: <Item item={{
        partnerId: 0,
        partnerNickName: "전체",
      }} />,
      text: '전체',
      value: 0,
    });

    return newItemList;
  }, [staticData]);

  return (
    <div className="flex flex-col gap-y-1">
      <Select
        value={props.value}
        onChange={props.onChange}
        options={options}
        placeholder="거래처"
      />
    </div>
  );
}

interface ItemProps {
  item: Model.Partner;
}

function Item(props: ItemProps) {
  const { item } = props;
  return (
    <div className="flex font-fixed gap-x-4">
      <div className="flex-1">{item.partnerNickName}</div>
    </div>
  );
}
