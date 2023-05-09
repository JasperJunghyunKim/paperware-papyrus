import { Model } from "@/@shared";
import { Select } from "antd";

const COLLECTED_OPTIONS = [
  {
    label: "외상 매입금",
    value: "COLLECTED_ACCOUNTS_RECEIVABLE" as Model.Enum.Subject,
  },
  {
    label: "미지급금",
    value: "COLLECTED_UNPAID_EXPENSES" as Model.Enum.Subject,
  },
  {
    label: "선지급금",
    value: "COLLECTED_PREPAID_EXPENSES" as Model.Enum.Subject,
  },
  {
    label: "잡손실",
    value: "COLLECTED_MISCELLANEOUS_LOSSES" as Model.Enum.Subject,
  },
  {
    label: "상품 매입",
    value: "COLLECTED_PRODUCT_PURCHASES" as Model.Enum.Subject,
  },
  {
    label: "기타",
    value: "ETC" as Model.Enum.Subject,
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
        value={props.value}
        onChange={props.onChange}
        options={COLLECTED_OPTIONS}
        placeholder="계정 과목"
      />
    </div>
  );
}
