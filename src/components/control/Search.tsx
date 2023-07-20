import { ConfigProvider, Input } from "antd";
import classNames from "classnames";
import { useCallback, useMemo, useState } from "react";
import { match } from "ts-pattern";

type OptionType = "text";
interface Option {
  type: OptionType;
  name: string;
  label?: string;
}
interface Props {
  options?: Option[];
  values: Record<string, string>;
  onSubmit: (values: Record<string, string>) => void;
}
export default function Component(props: Props) {
  const [data, setData] = useState<Record<string, string>>(props.values ?? {});

  const setFieldValue = useCallback(
    (name: string) => (value: string | undefined) => {
      if (value !== undefined) {
        setData((prev) => ({ ...prev, [name]: value }));
      } else {
        setData((prev) => {
          const next = { ...prev };
          delete next[name];
          return next;
        });
      }
    },
    []
  );

  const isNotEmpty = useMemo(
    () => Object.keys(props.values).length !== 0,
    [props.values]
  );

  return (
    <ConfigProvider componentSize="small">
      <div
        className="w-full h-full flex gap-x-2"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            props.onSubmit(data);
          }
        }}
      >
        <div
          className={classNames(
            "flex-1 flex flex-wrap gap-2 bg-white border p-2",
            {
              "border-gray-200": !isNotEmpty,
              "border-black": isNotEmpty,
            }
          )}
        >
          {props.options?.map((option, index) =>
            match(option.type)
              .with("text", () => (
                <OptionText
                  key={index}
                  label={option.label ?? option.name}
                  value={data[option.name]}
                  onChange={setFieldValue(option.name)}
                />
              ))
              .exhaustive()
          )}
        </div>
        {isNotEmpty && (
          <button
            className="flex-initial basis-24 bg-white border border-gray-200 hover:border-red-500 text-black"
            onClick={() => {
              props.onSubmit({});
              setData({});
            }}
          >
            초기화
          </button>
        )}
        <button
          className="flex-initial basis-24 bg-white border border-gray-200 hover:border-black text-black"
          onClick={() => props.onSubmit(data)}
        >
          검색
        </button>
      </div>
    </ConfigProvider>
  );
}

type OptionBaseProps<T = {}> = T & {
  label?: string;
  value: string | undefined;
  onChange: (value: string | undefined) => void;
};
function OptionText(props: OptionBaseProps) {
  return (
    <div className="flex-initial flex flex-col gap-y-1">
      <div className="flex-initial text-sm">{props.label}</div>
      <div className="flex-initial">
        <Input
          value={props.value}
          onChange={(e) =>
            props.onChange(
              e.target.value && e.target.value.length !== 0
                ? e.target.value
                : undefined
            )
          }
        />
      </div>
    </div>
  );
}
