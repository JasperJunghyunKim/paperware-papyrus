import classNames from "classnames";
import { ReactNode } from "react";

interface Props {
  icon?: ReactNode;
  label?: string;
  value?: string;
  iconClassName?: string;
}

export default function Component(props: Props) {
  return (
    <div
      className={
        "p-6 rounded-lg basis-1/5 flex-grow-0 flex flex-row justify-center border border-solid border-gray-200 select-none bg-white shadow-sm"
      }
    >
      {props.icon && (
        <div
          className={classNames(
            "basis-1/4 text-6xl flex flex-col justify-center text-gray-800",
            props.iconClassName
          )}
        >
          {props.icon}
        </div>
      )}
      <div className="flex-1 px-1 -mt-px flex flex-col gap-y-0 justify-center">
        <div className="flex-initial text-right text-sm text-gray-500 font-bold">
          {props.label}
        </div>
        <div className="flex-initial text-right text-3xl text-gray-800 font-extrabold">
          {props.value}
        </div>
      </div>
    </div>
  );
}
