//https://davidwalsh.name/async-function-class
const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;
const doImport = (new AsyncFunction('path, return await import("path", {assert: {type: "css"}});')) as (url: string) => Promise<StyleSheet>;

export async function importCSS(url: string) {
    return  await doImport(url);
}

