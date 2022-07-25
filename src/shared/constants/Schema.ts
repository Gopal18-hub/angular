export interface IHttpCacheResponse {
  url: string;
  body: any;
  lastModified: string | null;
}

export namespace Schema {
  export const version = 3;
  export const tables = {
    cachedResponses: "url, body, lastModified",
  };
}
