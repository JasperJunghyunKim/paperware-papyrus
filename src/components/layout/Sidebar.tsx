"use client";

import classNames from "classnames";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useMemo } from "react";
import Collapsible from "react-collapsible";
import { TbBox, TbBuilding, TbChevronDown } from "react-icons/tb";

interface MenuDef {
  icon: ReactNode;
  name: string;
  path: string;
  subs?: { name: string; path: string }[];
}

const menus: MenuDef[] = [
  {
    icon: <TbBuilding />,
    name: "고객사 관리",
    path: "/company",
  },
  {
    icon: <TbBox />,
    name: "메타데이터 관리",
    path: "/metadata",
    subs: [
      { name: "제품", path: "/product" },
      { name: "제품 유형", path: "/paper-domain" },
      { name: "지군", path: "/paper-group" },
      { name: "지종", path: "/paper-type" },
      { name: "제지사", path: "/manufacturer" },
      { name: "색군", path: "/paper-color-group" },
      { name: "색상", path: "/paper-color" },
      { name: "무늬", path: "/paper-pattern" },
      { name: "인증", path: "/paper-cert" },
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
      <div className="flex-initial basis-24 flex flex-col justify-center items-center text-2xl font-bold text-gray-700">
        PAPERWARE admin
      </div>
      <div className="flex-initial flex flex-col sticky top-0">
        {menuList.map((item) =>
          item.subs ? (
            <Collapsible
              key={item.key}
              trigger={
                <Menu
                  icon={item.icon}
                  label={item.name}
                  path={item.key}
                  chevron
                />
              }
              transitionTime={50}
              triggerClassName="flex-initial flex flex-col"
              triggerOpenedClassName="flex-initial flex flex-col"
              contentInnerClassName="flex-initial flex flex-col bg-gray-50 border-y border-gray-200"
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
  chevron?: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const checkActive = (path: string) =>
    props.sub ? pathname === path : pathname.startsWith(path);

  return (
    <div
      className={classNames(
        "flex-initial basis-12 flex items-center gap-x-2 cursor-pointer text-sm select-none",
        {
          "text-gray-500 hover:text-gray-800": !checkActive(props.path),
          "bg-black text-white font-bold":
            !props.sub && checkActive(props.path),
          "text-black font-bold": props.sub && checkActive(props.path),
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
      <div className="flex-1">{props.label}</div>
      {!props.sub && props.chevron && (
        <div className="flex-initial text-sm">
          <TbChevronDown />
        </div>
      )}
    </div>
  );
}
