import {define, BeDecoratedProps} from 'be-decorated/be-decorated.js';
import {BeLoadedVirtualProps, BeLoadedActions, BeLoadedProps, ILoadParams} from './types';
import {importCSS} from './importPolyfill.js';

export class BeLoadedController implements BeLoadedActions{
    intro(proxy: HTMLStyleElement & BeLoadedVirtualProps): void {
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
    async onLoadParams({fallback, preloadRef,  proxy}: this) {
        const loadParams: ILoadParams = {fallback, preloadRef}; 
        const stylesheet = await this.loadStylesheet(this, loadParams);
        if(stylesheet === true) {
            proxy.needsRedoing = true;
            return; //need to wait
        }
        if(stylesheet === false) return;
        (proxy.getRootNode() as any).adoptedStyleSheets = [stylesheet];
    }
    async onStylesheets({stylesheets, proxy}: this){
        const adoptedStylesheets: StyleSheet[] = [];
        for(const stylesheet of stylesheets){
            const adoptedStylesheet = await this.loadStylesheet(this, stylesheet);
            if(adoptedStylesheet === true) {
                proxy.needsRedoing = true;
                return; //need to wait
            }
            if(adoptedStylesheet === false) continue;
            adoptedStylesheets.push(adoptedStylesheet!);
        }
        (proxy.getRootNode() as any).adoptedStyleSheets = adoptedStylesheets;
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
            forceVisible: true,
            primaryProp: 'preloadRefs',
            virtualProps: ['stylesheets', 'fallback', 'preloadRef']
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

