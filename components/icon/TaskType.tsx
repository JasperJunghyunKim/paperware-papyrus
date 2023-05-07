import { Model } from "@/@shared";
import { TbCrop, TbRefresh } from "react-icons/tb";

interface Props {
  taskType?: Model.Enum.TaskType | null;
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
