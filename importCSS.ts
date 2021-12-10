import {StylesheetImport} from './types';
//https://davidwalsh.name/async-function-class
const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;
const doImport = (new AsyncFunction('path', 'return await import(path, {assert: {type: "css"}});')) as (url: string) => Promise<StylesheetImport>;

export async function importCSS(url: string) {
    if(navigator.userAgent.toLowerCase().indexOf('chrome') > -1) {
        return  await doImport(url);
    }else{
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = url;
        return link;
    }
    
}

