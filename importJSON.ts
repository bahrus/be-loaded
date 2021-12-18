//https://davidwalsh.name/async-function-class
const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;
const doImport = (new AsyncFunction('path', 'return await import(path, {assert: {type: "json"}});')) as (url: string) => Promise<any>;

export async function importJSON(preloadRef: string, fallbackUrl: string) {
    const preload = (<any>self)[preloadRef] as HTMLLinkElement | undefined;
    let url = fallbackUrl;
    if(preload !== undefined) {
        url = preload.href;
    }
    if(navigator.userAgent.toLowerCase().indexOf('chrome') > -1) {
        return  await doImport(url);
    }else{
        const resp = await fetch(url);
        return await resp.json();
    }
}