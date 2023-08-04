import { Rule } from "antd/lib/form";

export const email = (): Rule => ({
  type: "email",
  message: "이메일 형식이 올바르지 않습니다.",
});

export const confirm =
  (name: string): Rule =>
  ({ getFieldValue }) => ({
    validator(_, value) {
      if (getFieldValue(name) === value) {
        return Promise.resolve();
      }

      return Promise.reject("비밀번호가 일치하지 않습니다.");
    },
  });

export const length = (min: number, max: number): Rule => ({
  min,
  max,
  message: `${min}자 이상 ${max}자 이하로 입력해주세요.`,
});

export const lengthExact = (length: number): Rule => ({
  len: length,
  message: `${length}자로 입력해주세요.`,
});

export const phone = () => ({
  pattern: /^\d{9,11}$/,
  message: "휴대폰 번호 형식이 올바르지 않습니다.",
});

export const required = (): Rule => ({
  required: true,
  message: "필수 입력 항목입니다.",
});

export const password = (): Rule => ({
  pattern: /^(?=.*[a-zA-Z])(?=.*[0-9]).{10,}$/,
  message: "영문, 숫자를 포함한 10자 이상으로 입력해주세요.",
});

export const pattern = (regex: RegExp, message?: string): Rule => ({
  pattern: regex,
  message: message ?? "형식이 올바르지 않습니다.",
});

export const check = (fn: (value: any) => boolean, message: string): Rule => ({
  validator(_, value) {
    if (fn(value)) {
      return Promise.resolve();
    }

    return Promise.reject(message);
  },
});
