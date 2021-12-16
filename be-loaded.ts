import {define, BeDecoratedProps} from 'be-decorated/be-decorated.js';
import {BeLoadedVirtualProps, BeLoadedActions, BeLoadedProps, ILoadParams, StylesheetImport} from './types';
import {importCSS} from './importCSS.js';
import {register} from "be-hive/register.js";

export class BeLoadedController implements BeLoadedActions{
    #target!: HTMLStyleElement
    intro(proxy: HTMLStyleElement & BeLoadedVirtualProps, target: HTMLStyleElement): void {
        this.#target = target;
        if(document.readyState === 'loading'){
            proxy.domLoading = true;
            document.addEventListener('DOMContentLoaded', e => {
                proxy.domLoading = false;
                proxy.domLoaded = true;
                if(proxy.needsRedoing){
                    if(proxy.stylesheets !== undefined){
                        this.onStylesheets(this);
                    }else{
                        this.onLoadParams(this);
                    }
                }
            
            }, {once: true});
            return;
        }
        proxy.domLoaded = true;
    }
    async onLoadParams({fallback, preloadRef,  proxy, removeStyle}: this) {
        const loadParams: ILoadParams = {fallback, preloadRef}; 
        const stylesheet = await this.loadStylesheet(this, loadParams);
        if(stylesheet === true) {
            proxy.needsRedoing = true;
            return; //need to wait
        }
        if(stylesheet === false) return;
        const rn = proxy.getRootNode() as DocumentFragment;
        if(stylesheet instanceof HTMLLinkElement){
            rn.appendChild(stylesheet);
        }else{
            (rn as any).adoptedStyleSheets = [stylesheet.default];
        }
        setTimeout(() => {
            this.doRemoveStyle(this, rn);
        }, 20);
    }
    doRemoveStyle({removeStyle, proxy}: this, rn: DocumentFragment){
        switch(typeof removeStyle){
            case 'string':
                {
                    const styleToRemove = rn.querySelector(`#${removeStyle}`);
                    if(styleToRemove !== null) styleToRemove.remove();
                }
                break;
            case 'boolean':
                if(removeStyle){
                    this.#target.remove();
                }
        }
    }
    async onStylesheets({stylesheets, proxy, removeStyle: styleIdToRemove}: this){
        const adoptedStylesheets: StyleSheet[] = [];
        const rn = proxy.getRootNode() as DocumentFragment;
        for(const stylesheet of stylesheets){
            const adoptedStylesheet = await this.loadStylesheet(this, stylesheet);
            if(adoptedStylesheet === true) {
                proxy.needsRedoing = true;
                return; //need to wait
            }
            if(adoptedStylesheet === false) continue;
            if(stylesheet instanceof HTMLLinkElement){
                rn.appendChild(stylesheet);
            }else{
                adoptedStylesheets.push((adoptedStylesheet! as StylesheetImport).default);
            }
            
        }
        if(adoptedStylesheets.length > 0) (rn as any).adoptedStyleSheets = adoptedStylesheets;
        this.doRemoveStyle(this, rn);
    }

    async loadStylesheet({proxy, domLoading}: this, {fallback, preloadRef}: ILoadParams) {
        if(preloadRef !== undefined){
            const link = (<any>self)[preloadRef] as HTMLLinkElement;
            if(link !== undefined){
                return await importCSS(link.href!);
            }else if(domLoading){
                return true;
            }
        }
        if(fallback !== undefined){
            return await importCSS(fallback);
        }else{
            return false;
        }
    }
}

export interface BeLoadedController extends BeLoadedProps{}

const tagName = 'be-loaded';

const ifWantsToBe = 'loaded';

const upgrade = 'style';

define<BeLoadedProps & BeDecoratedProps<BeLoadedProps, BeLoadedActions>, BeLoadedActions>({
    config:{
        tagName,
        propDefaults:{
            upgrade,
            ifWantsToBe,
            forceVisible: ['style'],
            primaryProp: 'preloadRefs',
            virtualProps: ['stylesheets', 'fallback', 'preloadRef', 'domLoading', 'domLoaded', 'needsRedoing', 'removeStyle'],
            intro: 'intro',
        },
        actions:{
            onLoadParams:{
                ifKeyIn:['fallback', 'preloadRef', 'domLoaded'],
            },
            onStylesheets:{
                ifAllOf:['stylesheets']
            }
        }
    },
    complexPropDefaults:{
        controller: BeLoadedController,
    }
});

register(ifWantsToBe, upgrade, tagName);

