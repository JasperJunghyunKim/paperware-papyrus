import { Api } from "@/@shared";
import { atom } from "recoil";
import { v1 } from "uuid";

export const accountedAtom = atom<Api.PaidQuery>({
  key: `paid-condition-${v1()}`,
  default: {
    partnerId: 0,
    accountedSubject: 'All',
    accountedMethod: 'All',
    accountedFromDate: '',
    accountedToDate: '',
    skip: 0,
    take: 100,
  },
});
