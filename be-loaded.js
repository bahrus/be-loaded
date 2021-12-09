"use strict";
//https://davidwalsh.name/async-function-class
const AsyncFunction = Object.getPrototypeOf(async function () { }).constructor;
const doImport2 = (new AsyncFunction('return await import("https://unpkg.com/be-loaded/test.css", {assert: {type: "css"}});'));
async function doImport() {
    const style = await doImport2();
    console.log(style);
}
doImport();
