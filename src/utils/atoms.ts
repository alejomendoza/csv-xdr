import { atom, selector } from 'recoil';

export const settingsAtom = atom({
  key: 'settings',
  default: { publicKey: '', amount: '0', isTestnet: true, disabled: false },
});

export const accountListAtom = atom<{ publicKey: string }[]>({
  key: 'accountList',
  default: [],
});

export const xdrListAtom = atom<string[]>({ key: 'xdrList', default: [] });

export const progressAtom = atom<{
  status: 'empty' | 'loading' | 'complete' | 'error';
  amountComplete: number;
  error?: any;
}>({
  key: 'progressAtom',
  default: {
    status: 'empty',
    amountComplete: 0,
  },
});

export const progressSelector = selector({
  key: 'progressStatus',
  get: ({ get }) => {
    return get(progressAtom).status;
  },
});
