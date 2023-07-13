import classNames from "classnames";
import { ReactNode, useCallback, useState } from "react";

interface ButtonProps {
  text: string;
  icon?: ReactNode;
  onClick: (() => void) | (() => Promise<any>);
  disabled?: boolean;
  className?: string;
}

export default function Component(props: ButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const onClickHandler = useCallback(async () => {
    try {
      setIsLoading(true);
      const t = props.onClick();
      if (t instanceof Promise) {
        await t;
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [props.onClick]);

  return (
    <button
      className={classNames(
        "flex-initial h-10 bg-blue-500 disabled:bg-gray-500 text-white font-bold rounded-md flex flex-col justify-center items-center gap-x-1",
        props.className
      )}
      disabled={props.disabled || isLoading}
      onClick={onClickHandler}
    >
      {props.icon && <div className="flex-initial">{props.icon}</div>}
      <div className="flex-initial">{props.text}</div>
    </button>
  );
}
