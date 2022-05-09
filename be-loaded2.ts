import {define, BeDecoratedProps} from 'be-decorated/be-decorated.js';
import {BeLoadedVirtualProps, BeLoadedActions, BeLoadedProps, ILoadParams} from './types';
import {register} from 'be-hive/register.js';

export class BeLoaded implements BeLoadedActions{
    async onPath({path, proxy}: this): Promise<void> {
        const link = (<any>self)[path] as HTMLLinkElement | undefined;
        if(link !== undefined){
            await import('be-preemptive/be-preemptive.js');
            const rn = proxy.getRootNode() as DocumentFragment;
            await customElements.whenDefined('be-preemptive');
            const ifWantsToBe = (<any>rn.querySelector('be-preemptive')).ifWantsToBe;
            if(link.hasAttribute('is-' + ifWantsToBe)){
                const linkOrStylesheet = await (<any>link).beDecorated.preemptive.linkOrStylesheetPromise();
            }
            
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

            }
        },
        actions:{
            onPath:'path',
        },
    },
    complexPropDefaults:{
        controller: BeLoaded,
    },
});
