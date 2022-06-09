import { environment } from '@environments/environment';


export namespace ApiHeaders
{


    

    const fixedHeaders: any = {
        '172.30.0.16:1009' : {
            'Content-Type': 'application/json'
        },
        '172.30.0.16:1008': {
            'Content-Type': 'application/json'
        }
    }


    const dynamicHeaders: any = {
        '172.30.0.16:1009' : {
            'Content-Type': '#valu1#'
        },
        '172.30.0.16:1008': {
            'Content-Type': '#valu2#'
        }
    }

    export function getHeaders(url: string, data?: any) {
        const urlParsing = new URL(url);
        let host = urlParsing.hostname;
        if(host) {
            return fixedHeaders[host];
        } else {
            return  {};
        }
    }

}