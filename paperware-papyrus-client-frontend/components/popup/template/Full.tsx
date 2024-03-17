import { Modal } from "antd";
import { PropsWithChildren } from "react";
import { TbX } from "react-icons/tb";

export interface PropertyProps {
  title: string;
  open: boolean;
  onClose: (unit: false) => void;
  width?: string;
  height?: string;
}

export default function Component(props: PropsWithChildren<PropertyProps>) {
  return (
    <Modal
      open={props.open}
      onCancel={() => props.onClose(false)}
      footer={null}
      width={props.width ?? "500px"}
      closable={false}
      centered
      className="custom-modal"
      transitionName=""
      maskTransitionName=""
    >
      <div
        className="w-full h-full flex flex-col overflow-hidden"
        style={{ height: props.height ?? "calc(100vh - 220px)" }}
      >
        <div className="flex-initial flex px-3 py-2 font-bold text-lg bg-cyan-800 text-white rounded-t select-none">
          <div className="flex-1 mb-0.5">{props.title}</div>
          <div
            className="flex-initial cursor-pointer flex flex-col justify-center p-2 -m-2 hover:text-red-500"
            onClick={() => props.onClose(false)}
          >
            <TbX />
          </div>
        </div>
        <div className="flex-1 rounded-md flex overflow-hidden">
          {props.children}
        </div>
      </div>
    </Modal>
  );
}
