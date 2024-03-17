import { useIonRouter } from "@ionic/react";
import classNames from "classnames";
import { PropsWithChildren, ReactNode } from "react";
import { TbBox } from "react-icons/tb";

interface PageProps {
  title: string;
}

export default function Page(props: PropsWithChildren<PageProps>) {
  return (
    <div className="w-full h-full flex flex-col bg-slate-100">
      <div className="flex-initial text-xl font-bold p-3 pt-4 bg-white">
        {props.title}
      </div>
      <div className="flex-initial basis-px bg-slate-200" />
      <div className="flex-1">{props.children}</div>
      <div className="flex-initial basis-px bg-slate-200" />
      <div className="flex-initial flex p-3 bg-white">
        <Menu
          text="홈"
          icon={<TbBox className="fas fa-file-invoice" />}
          path="/home"
        />
        <Menu
          text="출고"
          icon={<TbBox className="fas fa-file-invoice" />}
          path="/invoice"
        />
      </div>
    </div>
  );
}

interface MenuProps {
  text: string;
  icon: ReactNode;
  path: string;
}
function Menu(props: MenuProps) {
  const router = useIonRouter();
  const pathname = router.routeInfo.pathname;

  const isActive = pathname.startsWith(props.path);

  return (
    <div
      className={classNames(
        "flex-1 flex flex-col gap-y-2 select-none cursor-pointer",
        {
          "text-gray-600": !isActive,
          "text-blue-600": isActive,
        }
      )}
      onClick={() => router.push(props.path)}
    >
      <div className="flex-initial flex justify-center text-2xl">
        {props.icon}
      </div>
      <div className="flex-initial text-center text-sm">{props.text}</div>
    </div>
  );
}
