import { atom, createStore } from "jotai";

export const tokenStore = createStore();

export const accessTokenAtom = atom<string | null>(null);
