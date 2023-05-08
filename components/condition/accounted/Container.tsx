import { PropsWithChildren } from "react";

export default function Container(props: PropsWithChildren) {
  return (
    <div className="flex-initial flex flex-row gap-x-4">{props.children}</div>
  );
}
