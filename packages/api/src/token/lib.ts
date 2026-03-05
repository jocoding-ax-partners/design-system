import { accessTokenAtom, tokenStore } from "./store";

export const setAccessToken = (accessToken: string) => {
  tokenStore.set(accessTokenAtom, accessToken);
};
