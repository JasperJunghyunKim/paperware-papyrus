import { Input } from "antd";
import { useCallback } from "react";
import { useDaumPostcodePopup } from "react-daum-postcode";
import { TbSearch } from "react-icons/tb";

interface Props {
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
}

export interface Address {
  address: string;
  detail: string;
}

export function encodeAddress(address: Partial<Address>) {
  return `${address.address}; ${address.detail}`;
}

export function decodeAddress(address: string | null | undefined): Address {
  try {
    if (!address) {
      return {
        address: "",
        detail: "",
      };
    }

    const [addressPart, detailPart] = address.split(";");
    return {
      address: addressPart.trim(),
      detail: detailPart.trim(),
    };
  } catch (e) {
    return {
      address: "",
      detail: "",
    };
  }
}

export default function Component(props: Props) {
  const postcode = useDaumPostcodePopup(
    "https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"
  );

  const value = decodeAddress(props.value);

  const selectPostCode = useCallback(() => {
    postcode({
      onComplete: (data) => {
        props.onChange?.(
          encodeAddress({
            address: data.address,
            detail: value.detail,
          })
        );
      },
    });
  }, [postcode, props, value.detail]);

  const updateDetail = useCallback(
    (detail: string) => {
      props.onChange?.(
        encodeAddress({
          address: value.address,
          detail,
        })
      );
    },
    [props, value.address]
  );

  return (
    <div className="flex flex-col gap-y-1">
      <Input
        addonBefore={<Addon label="주소" />}
        addonAfter={<AddonAfter onClick={() => selectPostCode()} />}
        value={value.address}
        rootClassName="custom-addon"
        readOnly
        disabled={props.disabled}
      />
      <Input
        addonBefore={<Addon label="상세 주소" />}
        value={value.detail}
        onChange={(p) => updateDetail(p.target.value ?? "")}
        rootClassName="custom-addon"
        disabled={props.disabled}
      />
    </div>
  );
}

function Addon(props: { label: string }) {
  return <div className="w-24">{props.label}</div>;
}

function AddonAfter(props: { onClick: () => void }) {
  return (
    <div
      className="cursor-pointer w-full h-full px-4"
      onClick={() => props.onClick()}
    >
      <TbSearch />
    </div>
  );
}
