import { API, type ErrorOptions } from "@nijesmik/openapi-ky";
import ky, { HTTPError } from "ky";

import { accessTokenAtom, tokenStore } from "./token/store";

interface Options extends ErrorOptions {
  onRefresh: () => Promise<string | undefined>;
}

export class AuthenticatedAPI<Paths extends object> extends API<Paths> {
  constructor(prefixUrl: string, { onRefresh, ...options }: Options) {
    super(
      {
        prefixUrl,
        retry: {
          limit: 1,
          methods: ["get", "post", "put", "patch", "delete"],
          shouldRetry: ({ error }) => {
            // HTTPError이고 401인 경우만 재시도
            if (error instanceof HTTPError) {
              return error.response?.status === 401;
            }
            // 네트워크 에러 등은 재시도하지 않음
            return false;
          },
        },
        hooks: {
          beforeRequest: [
            async (request) => {
              const accessToken = tokenStore.get(accessTokenAtom);

              if (accessToken) {
                request.headers.set("Authorization", `Bearer ${accessToken}`);
              }
            },
          ],
          beforeRetry: [
            async () => {
              try {
                const accessToken = await onRefresh();

                if (accessToken) {
                  tokenStore.set(accessTokenAtom, accessToken);
                  return;
                }
                tokenStore.set(accessTokenAtom, null);
              } catch (_error) {
                tokenStore.set(accessTokenAtom, null);
                return ky.stop;
              }
            },
          ],
        },
      },
      options,
    );
  }
}
