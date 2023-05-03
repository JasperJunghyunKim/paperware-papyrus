import { Util } from "@/common";
import { InputNumber } from "antd";

interface Props {
  value?: number | null;
  onChange?: (value: number | null) => void;
  unit?: string;
  min?: number;
  max?: number;
  pricision?: number;
}

export default function Component(props: Props) {
  return (
    <InputNumber
      value={props.value}
      onChange={(x) => props.onChange?.(x ?? null)}
      formatter={(x, state) =>
        (state.userTyping ? x : Util.comma(x))?.toString() ?? ""
      }
      precision={props.pricision}
      min={props.min}
      max={props.max}
      rootClassName="w-full"
      addonAfter={props.unit}
    />
  );
}
