//https://davidwalsh.name/async-function-class
//needed for CDN support
const AsyncFunction = Object.getPrototypeOf(async function () { }).constructor;
let doImport;
try {
    doImport = (new AsyncFunction('path', 'return await import(path, {assert: {type: "css"}});'));
}
catch (e) {
    console.warn(e);
}
export async function importCSS(url) {
    try {
        return await doImport(url);
    }
    catch (e) {
        console.warn(e);
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = url;
        return link;
    }
}
