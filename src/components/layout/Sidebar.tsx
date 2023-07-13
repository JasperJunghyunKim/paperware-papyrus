"use client";

import classNames from "classnames";
import { ReactNode, useMemo } from "react";
import Collapsible from "react-collapsible";
import { usePathname, useRouter } from "next/navigation";
import { TbBox } from "react-icons/tb";

interface MenuDef {
  icon: ReactNode;
  name: string;
  path: string;
  subs?: { name: string; path: string }[];
}

const menus: MenuDef[] = [
  {
    icon: <TbBox />,
    name: "메타데이터",
    path: "/metadata",
    subs: [
      { name: "제품 유형", path: "/paper-domain" },
      { name: "지군", path: "/paper-group" },
      { name: "지종", path: "/paper-type" },
      { name: "제지사", path: "/manufacturer" },
    ],
  },
  {
    icon: <TbBox />,
    name: "테스트",
    path: "/test",
    subs: [
      { name: "테스트1", path: "/hello" },
      { name: "테스트2", path: "/world" },
    ],
  },
];

export default function Component(props: { className?: string }) {
  const menuList = useMemo(
    () =>
      menus.map((p) => ({
        ...p,
        key: p.path,
        subs: p.subs?.map((s) => ({ ...s, key: `${p.path}${s.path}` })),
      })),
    [menus]
  );

  return (
    <aside className={classNames("bg-white flex flex-col", props.className)}>
      <div className="flex-initial basis-16 flex flex-col justify-center items-center text-2xl font-bold text-gray-700">
        PAPERWARE
      </div>
      <div className="flex-initial flex flex-col">
        {menuList.map((item) =>
          item.subs ? (
            <Collapsible
              key={item.key}
              trigger={
                <Menu icon={item.icon} label={item.name} path={item.key} />
              }
              transitionTime={50}
              triggerClassName="flex-initial flex flex-col"
              triggerOpenedClassName="flex-initial flex flex-col"
              contentInnerClassName="flex-initial flex flex-col"
            >
              {item.subs.map((sub) => (
                <Menu key={sub.key} label={sub.name} path={sub.key} sub link />
              ))}
            </Collapsible>
          ) : (
            <Menu
              key={item.key}
              icon={item.icon}
              label={item.name}
              path={item.key}
              link
            />
          )
        )}
      </div>
    </aside>
  );
}

function Menu(props: {
  label: string;
  path: string;
  icon?: ReactNode;
  sub?: boolean;
  link?: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const checkActive = (path: string) => pathname.startsWith(path);

  return (
    <div
      className={classNames(
        "flex-initial basis-10 flex items-center gap-x-2 cursor-pointer text-sm",
        {
          "text-gray-800/80 hover:text-gray-800": !checkActive(props.path),
          "bg-blue-500 text-white font-bold":
            !props.sub && checkActive(props.path),
          "text-blue-500": props.sub && checkActive(props.path),
          "px-4": !props.sub,
          "pl-8 pr-4": props.sub,
        }
      )}
      onClick={() => props.link && router.push(props.path)}
    >
      {props.icon && !props.sub && (
        <div className="flex-initial text-2xl">{props.icon}</div>
      )}
      {props.sub && <div className="flex-initial text-sm">•</div>}
      <div className="flex-initial">{props.label}</div>
    </div>
  );
}
