import { Subject, Observable } from "rxjs";

export namespace MaxHealthStorage {
  let storageSessionSub = new Subject<any>();

  let storageLocalSub = new Subject<any>();

  export function watchSessionStorage(): Observable<any> {
    return storageSessionSub.asObservable();
  }

  export function watchLocalStorage(): Observable<any> {
    return storageLocalSub.asObservable();
  }

  export function setSession(key: string, value: any) {
    if (sessionStorage) {
      sessionStorage.setItem(key, btoa(JSON.stringify(value)));
      storageSessionSub.next(key);
    }
  }

  export function getSession(key: string): any {
    if (sessionStorage) {
      let exist = sessionStorage.getItem(key);
      if (exist) return JSON.parse(atob(exist));
    }
  }

  export function set(key: string, value: any) {
    if (localStorage) {
      localStorage.setItem(key, btoa(JSON.stringify(value)));
      storageLocalSub.next(key);
    }
  }

  export function deleteSession(key: string) {
    if (sessionStorage) {
      sessionStorage.removeItem(key);
      storageSessionSub.next(key);
    }
  }
  export function get(key: string): any {
    if (localStorage) {
      let exist = localStorage.getItem(key);
      if (exist) return JSON.parse(atob(exist));
      else {
        return false;
      }
    } else {
      return false;
    }
  }

  export function remove(key?: string) {
    if (key) {
      if (localStorage) {
        localStorage.removeItem(key);
        storageLocalSub.next(key);
      }
    } else {
      if (localStorage) {
        localStorage.clear();
        storageLocalSub.next(0);
      }
    }
  }
  export function removeLocalStorage(key?: string) {
    if (key) {
      if (localStorage) localStorage.removeItem(key);
    } else {
      if (localStorage) localStorage.clear();
    }
  }

  export function getCookie(name: any) {
    //   var value = "; " + document.cookie;
    //   var parts: any = value.split("; " + name + "=");
    //   if (parts.length == 2) {
    //     const temp = unescape(parts.pop().split(";").shift());
    //     return temp;
    //   } else {
    //     return false;
    //   }
    let cookieValue = MaxHealthStorage.getSession(name);
    if (cookieValue != undefined && cookieValue != null)
      return MaxHealthStorage.getSession(name).toString();
    else return "";
  }
}
