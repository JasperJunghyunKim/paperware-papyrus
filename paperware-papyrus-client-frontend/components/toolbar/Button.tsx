import { Util } from "@/common";
import { Tooltip } from "antd";
import classNames from "classnames";
import { ReactNode, useCallback, useState } from "react";

interface Props {
  icon?: ReactNode;
  label?: string;
  type?: ButtonType;
  onClick?: Util.PromiseOrFn;
  disabled?: boolean;
  tooltip?: string;
}

export type ButtonType =
  | "default"
  | "primary"
  | "secondary"
  | "orange"
  | "danger";

export default function Component(props: Props) {
  const buttonType = props.type ?? "default";
  const [pending, setPending] = useState(false);

  const disabled = props.disabled || pending;

  const call = useCallback(async () => {
    if (disabled) {
      return;
    }

    setPending(true);
    await Util.call(props.onClick);
    setPending(false);
  }, [disabled, props.onClick]);

  return (
    <Tooltip title={props.tooltip}>
      <button
        className={classNames(
          "p-2 rounded-full flex flex-row justify-center border border-solid select-none",
          {
            "bg-gray-300 hover:bg-gray-300 text-white cursor-not-allowed":
              disabled,
            "bg-gray-50 hover:bg-white text-gray-800 border-gray-300 hover:border-gray-600":
              !disabled && buttonType === "default",
            "bg-cyan-600 hover:bg-cyan-500 text-white":
              !disabled && buttonType === "primary",
            "bg-green-700 hover:bg-green-600 text-white":
              !disabled && buttonType === "secondary",
            "bg-orange-600 hover:bg-orange-500 text-white":
              !disabled && buttonType === "orange",
            "bg-red-700 hover:bg-red-600 text-white":
              !disabled && buttonType === "danger",
          }
        )}
        onClick={() => call()}
      >
        {props.icon && (
          <div className="flex-initial text-2xl flex flex-col justify-center">
            {props.icon}
          </div>
        )}
        <div className="flex-initial px-1 -mt-px flex flex-col justify-center h-full text-base">
          {props.label}
        </div>
      </button>
    </Tooltip>
  );
}
