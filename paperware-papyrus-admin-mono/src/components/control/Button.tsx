import classNames from "classnames";
import { useCallback, useState } from "react";

type Color = "black" | "white" | "red" | "blue";
const buttonColor = {
  black: "bg-black hover:bg-gray-800 border border-black text-white",
  white: "bg-white hover:bg-gray-50 border border-gray-200 text-black",
  red: "bg-red-500 hover:bg-red-600 border border-red-600 text-white",
  blue: "bg-blue-500 hover:bg-blue-600 border border-blue-600 text-white",
};
interface Props {
  icon?: React.ReactNode;
  text: string;
  className?: string;
  color?: Color;
  disabled?: boolean;
  onClick?: (() => void) | (() => Promise<void>);
}
export default function Button(props: Props) {
  const [disabled, setDisabled] = useState(false);
  const clickHandler = useCallback(async () => {
    try {
      if (props.onClick) {
        setDisabled(true);
        await props.onClick();
      }
    } finally {
      setDisabled(false);
    }
  }, [props.onClick]);

  return (
    <button
      className={classNames(
        "flex items-center justify-center gap-x-1 h-8 rounded px-2 disabled:bg-gray-400 disabled:border-gray-500 disabled:text-gray-600 disabled:cursor-not-allowed",
        buttonColor[props.color ?? "black"],
        props.className
      )}
      onClick={clickHandler}
      disabled={props.disabled || disabled}
    >
      {props.icon && <div className="flex-initial text-2xl">{props.icon}</div>}
      <div className="flex-initial whitespace-nowrap text-base">
        {props.text}
      </div>
    </button>
  );
}
