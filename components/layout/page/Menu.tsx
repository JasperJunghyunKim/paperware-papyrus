import { Util } from "@/common";
import classnames from "classnames";
import Link from "next/link";
import { useRouter } from "next/router";
import { TbHourglassFilled } from "react-icons/tb";

export interface MenuProps {
  menus: Menu[];
}

export interface Menu {
  path: string | null;
  label?: string;
  icon?: JSX.Element;
  wip?: boolean;
  noti?: number;
}

export default function Component(props: MenuProps) {
  const router = useRouter();

  const isActive = (path: string | null) => {
    return router.pathname === path;
  };

  return (
    <div className="flex flex-col px-3 gap-y-1 select-none text-sm">
      {props.menus.map((menu, index) =>
        menu.path ? (
          <div
            className={classnames(
              "flex-initial rounded text-black/[.6] hover:text-black/[.8]",
              {
                "bg-cyan-600 hover:bg-cyan-600": isActive(menu.path),
                "text-white hover:text-white": isActive(menu.path),
                "font-bold": isActive(menu.path),
              }
            )}
            key={menu.path}
          >
            <Link href={menu.path} className="block w-full h-full p-2">
              <div className="flex items-center gap-x-2">
                <div className="flex-initial text-2xl flex flex-col justify-center">
                  {menu.icon}
                </div>
                <div className="flex-1">{menu.label}</div>
                {menu.noti && menu.noti > 0 ? (
                  <div
                    className={classnames(
                      "flex-initial flex items-center justify-center px-1 py-0.5 rounded-full bg-red-500 text-xs font-bold",
                      {
                        "bg-yellow-400 text-cyan-700": isActive(menu.path),
                        "text-white": !isActive(menu.path),
                      }
                    )}
                  >
                    {menu.noti > 99 ? "99+" : menu.noti}
                  </div>
                ) : null}
                {menu.wip && (
                  <div className={"flex-initial"}>
                    <TbHourglassFilled />
                  </div>
                )}
              </div>
            </Link>
          </div>
        ) : (
          <div className="basis-px bg-slate-200" key={index} />
        )
      )}
    </div>
  );
}
