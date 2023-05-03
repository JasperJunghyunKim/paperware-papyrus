import { Protocol } from "@/common";
import { BiCube, BiCylinder, BiLayer, BiPackage } from "react-icons/bi";

interface Props {
  packagingType?: Protocol.Record.PackagingType | null;
}

export default function Component(props: Props) {
  switch (props.packagingType) {
    case "BOX":
      return <BiPackage />;
    case "REAM":
      return <BiCube />;
    case "SKID":
      return <BiLayer />;
    case "ROLL":
      return <BiCylinder />;
    default:
      return null;
  }
}
