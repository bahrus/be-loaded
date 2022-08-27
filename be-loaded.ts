import {define, BeDecoratedProps} from 'be-decorated/be-decorated.js';
import {BeLoadedVirtualProps, BeLoadedActions, BeLoadedProps} from './types';
import {register} from 'be-hive/register.js';
import {LinkOrStylesheet} from 'be-preemptive/types';

export class BeLoaded extends EventTarget implements BeLoadedActions{

    #insertStylesheet(rn: DocumentFragment, linkOrStylesheet: LinkOrStylesheet){
        if(linkOrStylesheet instanceof HTMLLinkElement){
            rn.appendChild(linkOrStylesheet);
        }else{
            (rn as any).adoptedStyleSheets = [...(rn as any).adoptedStyleSheets, linkOrStylesheet.default];
        }
        this.proxy.resolved = true;
    }
    async onPath({path, proxy, CDNFallback, version}: this): Promise<void> {
        const link = (<any>self)[path] as HTMLLinkElement | undefined;
        const rn = proxy.getRootNode() as DocumentFragment;
        if(link !== undefined){
            await import('be-preemptive/be-preemptive.js');
            await customElements.whenDefined('be-preemptive');
            const ifWantsToBe = (<any>rn.querySelector('be-preemptive')).ifWantsToBe;
            if(link.matches(`[be-${ifWantsToBe}]`) && link.parentElement !== null){
                const {attachBehiviors} = await import('be-vigilant/attachBehiviors.js');
                await attachBehiviors(link.parentElement);
            }
            if(link.matches(`[is-${ifWantsToBe}]`)){
                let linkOrStylesheetPromise = (<any>link)?.beDecorated?.preemptive?.linkOrStylesheetPromise as Promise<LinkOrStylesheet> | undefined;
                if(linkOrStylesheetPromise !== undefined){
                    linkOrStylesheetPromise.then((linkOrStylesheet: LinkOrStylesheet) => {
                        this.#insertStylesheet(rn, linkOrStylesheet);
                    });
                }else{
                    link.addEventListener('be-decorated.preemptive.link-or-stylesheet-promise-changed', e => {
                        linkOrStylesheetPromise = (<any>e).detail.value as Promise<LinkOrStylesheet>;
                        linkOrStylesheetPromise.then((linkOrStylesheet: LinkOrStylesheet) => {
                            this.#insertStylesheet(rn, linkOrStylesheet);
                        });
                    }, {once: true});
                }
                
            }
        }else{
            //try doing an import and rely on import maps for dependency injection
            const {importCSS} = await import('be-preemptive/importCSS.js');
            const result = await importCSS(path, true);
            switch(typeof result){
                case 'string':
                    switch(result){
                        case 'SyntaxError':
                            //no support for import maps either for now (not sure which will come first with firefox/safari)
                            //do same thing as simply not found?
                        case '404':
                            const versionedPath = version !== undefined ? path.replace('/', '@' + version + '/') : path;
                            const linkOrStylesheet =  await importCSS(CDNFallback + versionedPath) as LinkOrStylesheet;
                            this.#insertStylesheet(rn, linkOrStylesheet)                
                        break;
                    }
                    break;
                case 'object':
                    if(result instanceof HTMLLinkElement){
                        rn.appendChild(result);
                    }else{
                        (rn as any).adoptedStyleSheets = [...(rn as any).adoptedStyleSheets, result.default];
                    }
            }

        }
        this.doRemoveStyle(this, proxy.getRootNode() as DocumentFragment);
    }

    doRemoveStyle({removeStyle, proxy}: this, rn: DocumentFragment){
        switch(typeof removeStyle){
            case 'string':
                {
                    const styleToRemove = rn.querySelector(`#${removeStyle}`);
                    if(styleToRemove !== null) styleToRemove.innerHTML = '';
                }
                break;
            case 'boolean':
                if(removeStyle){
                    proxy.self.innerHTML = '';
                }
                break;
        }
    }
}

export interface BeLoaded extends BeLoadedProps{}

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
            virtualProps: ['CDNFallback', 'path', 'version', 'removeStyle'],
            primaryProp: 'path',
            proxyPropDefaults:{
                CDNFallback: 'https://cdn.jsdelivr.net/npm/',

            },
        },
        actions:{
            onPath:'path',
        },
    },
    complexPropDefaults:{
        controller: BeLoaded,
    },
});

register(ifWantsToBe, upgrade, tagName);
