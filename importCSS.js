//https://davidwalsh.name/async-function-class
const AsyncFunction = Object.getPrototypeOf(async function () { }).constructor;
const doImport = (new AsyncFunction('path', 'return await import(path, {assert: {type: "css"}});'));
export async function importCSS(url) {
    try {
        //console.log(`importing ${url}`);
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
