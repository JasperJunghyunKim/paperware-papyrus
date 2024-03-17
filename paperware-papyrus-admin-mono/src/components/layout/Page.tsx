import classNames from "classnames";
import { PropsWithChildren } from "react";

interface PageProps {
  title: string;
  wrapperClassName?: string;
  containerClassName?: string;
}
export default function Component(props: PropsWithChildren<PageProps>) {
  return (
    <div
      className={classNames(
        "flex flex-col",
        props.wrapperClassName ?? "flex-initial"
      )}
    >
      <div className="flex-initial flex items-center text-xl font-bold p-4">
        {props.title}
      </div>
      <div className={props.containerClassName ?? "flex-initial"}>
        {props.children}
      </div>
    </div>
  );
}
