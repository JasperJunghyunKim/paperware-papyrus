import { Model } from "@/@shared";
import { Select } from "antd";

const METHOD_OPTIONS = [
  {
    label: "전체",
    value: "All" as Model.Enum.Method,
  },
  // {
  //   label: "계좌 이체",
  //   value: "ACCOUNT_TRANSFER" as Model.Enum.Method,
  // },
  // {
  //   label: "유가증권",
  //   value: "PROMISSORY_NOTE" as Model.Enum.Method,
  // },
  // {
  //   label: "카드입금",
  //   value: "CARD_PAYMENT" as Model.Enum.Method,
  // },
  {
    label: "현금",
    value: "CASH" as Model.Enum.Method,
  },
  // {
  //   label: "상계",
  //   value: "SET_OFF" as Model.Enum.Method,
  // },
  {
    label: "기타",
    value: "ETC" as Model.Enum.Method,
  },
];

interface Props {
  value?: number;
  onChange?: (value: number) => void;
}

export default function Component(props: Props) {
  return (
    <div className="flex flex-col gap-y-1">
      <Select
        defaultValue={0}
        value={props.value}
        onChange={props.onChange}
        options={METHOD_OPTIONS}
        placeholder="계정 과목"
      />
    </div>
  );
}
