//https://davidwalsh.name/async-function-class
const AsyncFunction = Object.getPrototypeOf(async function () { }).constructor;
const doImport = (new AsyncFunction('path, return await import("path", {assert: {type: "css"}});'));
export async function importCSS(url) {
    return await doImport(url);
}
