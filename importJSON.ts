//https://davidwalsh.name/async-function-class
const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;
const doImport = (new AsyncFunction('path', 'return await import(path, {assert: {type: "json"}});')) as (url: string) => Promise<any>;

export async function importJSON(preloadRef: string, fallbackUrl: string = 'https://www.jsdelivr.com/' + preloadRef) {
    const preload = (<any>self)[preloadRef] as HTMLLinkElement | undefined;
    let url = fallbackUrl;
    if(preload !== undefined) {
        url = preload.href;
    }
    try {
        return  await doImport(url);
    }catch(e){
        console.warn(e);
        const resp = await fetch(url);
        const def =  await resp.json();
        return {default: def};
    }
        
}