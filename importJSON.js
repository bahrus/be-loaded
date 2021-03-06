//https://davidwalsh.name/async-function-class
const AsyncFunction = Object.getPrototypeOf(async function () { }).constructor;
const doImport = (new AsyncFunction('path', 'return await import(path, {assert: {type: "json"}});'));
export async function importJSON(preloadRef, fallbackUrl = 'https://cdn.jsdelivr.net/npm/' + preloadRef) {
    const preload = self[preloadRef];
    let url = fallbackUrl;
    if (preload !== undefined) {
        url = preload.href;
    }
    try {
        return await doImport(url);
    }
    catch (e) {
        console.warn(e);
        const resp = await fetch(url);
        const def = await resp.json();
        return { default: def };
    }
}
