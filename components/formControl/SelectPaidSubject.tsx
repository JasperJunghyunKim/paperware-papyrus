import { Model } from "@/@shared";
import { Select } from "antd";

const PAID_SUBJECT_OPTIONS = [
  {
    label: "전체",
    value: "All" as Model.Enum.Subject,
  },
  {
    label: "외상 매출금",
    value: "PAID_ACCOUNTS_RECEIVABLE" as Model.Enum.Subject,
  },
  {
    label: "미수금",
    value: "PAID_UNPAID_AMOUNTS" as Model.Enum.Subject,
  },
  {
    label: "선수금",
    value: "PAID_ADVANCES" as Model.Enum.Subject,
  },
  {
    label: "잡이익",
    value: "PAID_MISCELLANEOUS_INCOME" as Model.Enum.Subject,
  },
  {
    label: "상품 매출",
    value: "PAID_PRODUCT_SALES" as Model.Enum.Subject,
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
        defaultValue={'All' as Model.Enum.Subject as any}
        value={props.value as unknown as Model.Enum.Subject as any}
        onChange={props.onChange}
        options={PAID_SUBJECT_OPTIONS}
        placeholder="계정 과목"
      />
    </div>
  );
}
