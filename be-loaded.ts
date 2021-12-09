import {define, BeDecoratedProps} from 'be-decorated/be-decorated.js';
import {BeLoadedVirtualProps, BeLoadedActions, BeLoadedProps, ILoadParams} from './types';
import {importCSS} from './importPolyfill.js';

export class BeLoadedController implements BeLoadedActions{
    async onLoadParams({fallback, preloadRef, stylesheets, proxy}: this) {
        const loadParams: ILoadParams = {fallback, preloadRef}; 
        const stylesheet = await this.loadStylesheet(this, loadParams);
        (proxy.getRootNode() as any).adoptedStyleSheets = [stylesheet];
    }
    async onStylesheets({stylesheets, proxy}: this){
        const adoptedStylesheets: StyleSheet[] = [];
        for(const stylesheet of stylesheets){
            const adoptedStylesheet = await this.loadStylesheet(this, stylesheet);
            adoptedStylesheets.push(adoptedStylesheet!);
        }
        (proxy.getRootNode() as any).adoptedStyleSheets = adoptedStylesheets;
    }

    async loadStylesheet({proxy}: this, {fallback, preloadRef}: ILoadParams) {
        if(preloadRef !== undefined && (<any>self)[preloadRef] !== undefined){
            const link = (<any>self)[preloadRef] as HTMLLinkElement;
            const stylesheet = await importCSS(link.href!);
            return stylesheet;
        }else if(fallback !== undefined){
            const stylesheet = await importCSS(fallback);
            return stylesheet;
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
                ifKeyIn:['fallback', 'preloadRef'],
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

