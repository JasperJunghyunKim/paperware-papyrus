import { atom } from "recoil";
import { v1 } from "uuid";

export const session$ = atom({
  key: `session-${v1()}`,
  default: null,
});
