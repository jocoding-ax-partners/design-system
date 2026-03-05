import { API, type ErrorOptions } from "@nijesmik/openapi-ky";

export class UnauthenticatedAPI<Paths extends object> extends API<Paths> {
  constructor(prefixUrl: string, options?: ErrorOptions) {
    super(
      {
        prefixUrl,
        retry: 0,
      },
      options,
    );
  }
}
