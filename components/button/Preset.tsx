import { TbCircleCheck, TbPencil } from "react-icons/tb";
import { Button } from "..";

export interface BaseProps {
  label: string;
  hidden?: boolean;
}

export interface BasePropsWithOnClick extends BaseProps {
  onClick: () => void;
}

export function Submit(props: BaseProps) {
  return (
    <Button.Default
      icon={<TbCircleCheck />}
      label={props.label}
      type="primary"
      hidden={props.hidden}
      submit
    />
  );
}

export function Edit(props: BasePropsWithOnClick) {
  return (
    <Button.Default
      icon={<TbPencil />}
      label={props.label}
      type="default"
      onClick={props.onClick}
      hidden={props.hidden}
    />
  );
}
