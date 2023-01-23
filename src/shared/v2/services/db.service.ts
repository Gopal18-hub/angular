import { Injectable } from "@angular/core";
import Dexie from "dexie";
import { Schema, IHttpCacheResponse } from "../constants/Schema";

@Injectable({
  providedIn: "root",
})
export class DbService extends Dexie {
  cachedResponses!: Dexie.Table<IHttpCacheResponse, String>;

  constructor() {
    super("MaxHealth");

    this.version(Schema.version).stores(Schema.tables);

    this.on("populate", () => this.populate());
  }

  async populate() {}

  getCacheResponse(url: string): Promise<any> {
    return this.cachedResponses.get(url);
  }

  putCacheResponse(responseToUpdate: IHttpCacheResponse): Promise<String> {
    return this.cachedResponses.put(responseToUpdate);
  }
}
