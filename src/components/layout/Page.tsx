import { PropsWithChildren } from "react";

interface PageProps {
  title: string;
}
export default function Component(props: PropsWithChildren<PageProps>) {
  return (
    <div className="flex-initial flex flex-col w-0">
      <div className="flex-initial basis-12 flex items-center text-lg font-bold px-4">
        {props.title}
      </div>
      <div className="flex-initial flex">{props.children}</div>
    </div>
  );
}
