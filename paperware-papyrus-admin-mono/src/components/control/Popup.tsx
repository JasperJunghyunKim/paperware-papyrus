import { PropsWithChildren, ReactNode } from "react";
import ReactModal from "react-modal";

interface Props {
  open: boolean;
  onClose: (unit: false) => void;
  title: string;
  icon?: ReactNode;
  width?: string;
  height?: string;
  footer?: ReactNode;
}
export default function Component(props: PropsWithChildren<Props>) {
  return (
    <ReactModal
      isOpen={props.open}
      onRequestClose={() => props.onClose(false)}
      shouldCloseOnEsc
      shouldCloseOnOverlayClick
      overlayClassName="bg-black/50 left-0 top-0 bottom-0 right-0 fixed z-50"
      contentElement={(x) => (
        <div
          {...x}
          className="bg-white flex flex-col rounded-md overflow-hidden"
          style={{
            width: props.width ?? "calc(100vw - 2rem)",
            height: props.height ?? "calc(100vh - 2rem)",
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <div className="flex-initial flex items-center px-4 gap-x-2 font-semibold basis-12 border-b border-gray-200">
            {props.icon && (
              <div className="flex-initial text-xl">{props.icon}</div>
            )}
            <div className="flex-1">{props.title}</div>
          </div>
          <div className="flex-1 h-0">{props.children}</div>
          {props.footer && (
            <div className="flex-initial border-t border-gray-200">
              {props.footer}
            </div>
          )}
        </div>
      )}
    ></ReactModal>
  );
}
