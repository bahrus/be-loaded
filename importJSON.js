//https://davidwalsh.name/async-function-class
const AsyncFunction = Object.getPrototypeOf(async function () { }).constructor;
const doImport = (new AsyncFunction('path', 'return await import(path, {assert: {type: "json"}});'));
export async function importJSON(preloadRef, fallbackUrl) {
    const preload = self[preloadRef];
    let url = fallbackUrl;
    if (preload !== undefined) {
        url = preload.href;
    }
    if (navigator.userAgent.toLowerCase().indexOf('chrome') > -1) {
        return await doImport(url);
    }
    else {
        const resp = await fetch(url);
        return await resp.json();
    }
}
