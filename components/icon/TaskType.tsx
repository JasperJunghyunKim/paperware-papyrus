import { Protocol } from "@/common";
import { TbCrop, TbRefresh } from "react-icons/tb";

interface Props {
  taskType?: Protocol.Record.TaskType | null;
}

export default function Component(props: Props) {
  switch (props.taskType) {
    case "CONVERTING":
      return <TbRefresh />;
    case "GUILLOTINE":
      return <TbCrop />;
    default:
      return null;
  }
}
