import { environment } from "@environments/environment";

export namespace ApiHeaders {
  const fixedHeaders: any = {
    "172.30.0.16:1009": {
      "Content-Type": "application/json",
    },
    "172.30.0.16:1008": {
      "Content-Type": "application/json",
    },
    "MaxHIS-Idsrv-dev.maxhealthcare.in": {
      "Content-Type": "application/json",
    },
    "MaxHIS-Reports-dev.maxhealthcare.in": {
      "Content-Type": "application/json",
    },
    "localhost:8100": {
      "Content-Type": "application/json",
    },
    "localhost:4200": {
      "Content-Type": "application/json",
    },
    "MaxHIS-Idsrv-sit.maxhealthcare.in": {
      "Content-Type": "application/json",
    },
    "MaxHIS-Idsrv-uat.maxhealthcare.in": {
      "Content-Type": "application/json",
    },
    "MaxHIS-common-uat.maxhealthcare.in": {
      "Content-Type": "application/json",
    },
    "MaxHIS-common-sit.maxhealthcare.in": {
      "Content-Type": "application/json",
    },
    "MaxHIS-OpReg-sit.maxhealthcare.in": {
      "Content-Type": "application/json",
    },
    "MaxHIS-OpReg-uat.maxhealthcare.in": {
      "Content-Type": "application/json",
    },
  };

  const dynamicHeaders: any = {
    "172.30.0.16:1009": {
      "Content-Type": "#valu1#",
    },
    "172.30.0.16:1008": {
      "Content-Type": "#valu2#",
    },
  };

  export function getHeaders(url: string, data?: any) {
    const urlParsing = new URL(url);    
    let host = urlParsing.hostname;
    if (host) {
      return fixedHeaders[host];
    } else {
      return {};
    }
  }
}
