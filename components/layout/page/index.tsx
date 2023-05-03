import { Api, Util } from "@/common";
import { Button, Logo } from "@/components";
import { AutoComplete, ConfigProvider, Input } from "antd";
import { useRouter } from "next/router";
import { PropsWithChildren, useCallback, useEffect, useMemo } from "react";
import {
  TbBuildingWarehouse,
  TbChartDots,
  TbClipboardData,
  TbClipboardList,
  TbColorSwatch,
  TbFunction,
  TbHome2,
  TbHomeMove,
  TbInputSearch,
  TbMapPin,
  TbPower,
  TbSearch,
  TbServer,
  TbServer2,
  TbServerBolt,
  TbSubtask,
  TbTournament,
  TbTruck,
  TbUsers,
} from "react-icons/tb";
import { useStickyBox } from "react-sticky-box";
import Menu, { Menu as MenuDef } from "./Menu";

export interface Props {
  title: string;
}

export default function Component(props: PropsWithChildren<Props>) {
  const router = useRouter();
  const stickyRef = useStickyBox({ offsetTop: 0, offsetBottom: 0 });

  const requestStats =
    Api.External.BusinessRelationship.useGetBusinessRelationshipRequestStats();

  const menus = useMemo<MenuDef[]>(
    () => [
      { label: "대시보드", icon: <TbChartDots />, path: "/", noti: 0 },
      { path: null },
      {
        label: "자사 재고 관리",
        icon: <TbServer2 />,
        path: "/stock",
      },
      {
        label: "도착 예정 목록",
        icon: <TbServerBolt />,
        path: "/arrival-stock",
      },
      {
        label: "보관 재고 관리",
        icon: <TbServer />,
        path: "/stored-stock",
      },
      { label: "창고 관리", icon: <TbBuildingWarehouse />, path: "/warehouse" },
      { path: null },
      {
        label: "매입처 재고 조회",
        icon: <TbInputSearch />,
        path: "/purchase-stock",
      },
      {
        label: "매입 주문 목록",
        icon: <TbClipboardList />,
        path: "/purchase-order",
      },
      {
        label: "매입처 관리",
        icon: <TbHome2 />,
        path: "/business-relationship-purchase",
      },
      { path: null },
      {
        label: "매출 수주 목록",
        icon: <TbSubtask />,
        path: "/sales-order",
      },
      {
        label: "견적 요청 목록",
        icon: <TbClipboardData />,
        path: "/estimate",
        wip: true,
      },
      {
        label: "매출처 관리",
        icon: <TbHomeMove />,
        path: "/business-relationship-sales",
        noti: requestStats.data?.pendingCount,
      },
      { path: null },
      {
        label: "작업 계획 목록",
        icon: <TbTournament />,
        path: "/plan",
      },
      { label: "공정 목록", icon: <TbFunction />, path: "/task", wip: true },
      { label: "배송 목록", icon: <TbTruck />, path: "/shipping" },
      { path: null },
      {
        label: "도착지 관리",
        icon: <TbMapPin />,
        path: "/location",
      },
      {
        label: "고시가 설정",
        icon: <TbColorSwatch />,
        path: "/official-price",
        wip: true,
      },
      { label: "직원 설정", icon: <TbUsers />, path: "/staff", wip: true },
    ],
    []
  );

  const user = Api.Auth.useGetMe();

  useEffect(() => {
    if (user.isError) {
      router.replace("/login");
    }
  }, [router, user.isError]);

  const logout = useCallback(async () => {
    if (!(await Util.confirm("로그아웃 하시겠습니까?"))) return;

    localStorage.removeItem("at");
    router.replace("/login");
  }, []);

  return (
    <>
      <div className="flex ">
        <div className="basis-60 flex-shrink-0 flex-grow-0 bg-white text-black border-solid border-0 border-r border-gray-200">
          <aside ref={stickyRef}>
            <Logo.Paperware />
            <div className="flex-initial">
              <Menu menus={menus} />
            </div>
          </aside>
        </div>
        <div className="flex-1 w-0 bg-slate-100 flex flex-col">
          <header className="flex flex-initial px-4 h-16 bg-white border-solid border-0 border-b border-gray-200 select-none fixed top-0 right-0 left-60 z-10">
            <div className="flex flex-row items-center  w-full h-full">
              <ConfigProvider theme={{ token: { borderRadius: 100 } }}>
                <AutoComplete dropdownMatchSelectWidth={500} className="w-64">
                  <Input placeholder="검색" addonAfter={<TbSearch />} />
                </AutoComplete>
              </ConfigProvider>
            </div>
            <div className="flex-initial flex gap-x-4">
              <div className="flex-initial flex flex-col justify-center font-bold">
                {user.data?.username}
              </div>
              <div className="flex-initial flex flex-col justify-center">
                <Button.Default
                  icon={<TbPower />}
                  label="로그아웃"
                  onClick={logout}
                />
              </div>
            </div>
          </header>
          <main className="flex flex-col flex-1 p-4 gap-4 mt-16 min-h-screen">
            <h1 className="flex-initial font-extrabold text-xl select-none m-0">
              {props.title}
            </h1>
            <section className="flex flex-col gap-4">{props.children}</section>
          </main>
        </div>
      </div>
    </>
  );
}
