import Sidebar from "@/components/layout/Sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex w-full h-full min-w-screen min-h-screen bg-slate-50 divide-x">
      <Sidebar className="flex-initial basis-64 sticky" />
      <div className="flex-1 flex flex-col divide-y w-0">
        <div className="flex-initial">{children}</div>
      </div>
    </div>
  );
}
