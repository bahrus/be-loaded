import {StylesheetImport} from './types';
//https://davidwalsh.name/async-function-class
//needed for CDN support
const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;
let doImport: any;
try{
    doImport = (new AsyncFunction('path', 'return await import(path, {assert: {type: "css"}});')) as (url: string) => Promise<StylesheetImport>;
}catch(e){
    console.warn(e);
}

export async function importCSS(url: string) {
    try{
        return  await doImport(url);
    }catch(e){
        console.warn(e);
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = url;
        return link;
    }
    
}

