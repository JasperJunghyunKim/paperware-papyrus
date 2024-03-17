import { Util } from "@/lib";
import { DatePicker } from "antd";

interface Props {
  value?: string;
  onChange?: (value: string | undefined) => void;
  disabled?: boolean;
  placeholder?: string;
}

export default function Component(props: Props) {
  return (
    <div className="flex-initial flex flex-col gap-y-1">
      <DatePicker
        value={Util.Parser.iso8601ToDate(props.value)}
        onChange={(x) => props.onChange?.(Util.Parser.dateToIso8601(x))}
        disabled={props.disabled}
        placeholder={props.placeholder}
      />
    </div>
  );
}
