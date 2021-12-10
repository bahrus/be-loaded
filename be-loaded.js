import { define } from 'be-decorated/be-decorated.js';
import { importCSS } from './importCSS.js';
export class BeLoadedController {
    intro(proxy) {
        if (document.readyState === 'loading') {
            proxy.domLoading = true;
            document.addEventListener('DOMContentLoaded', e => {
                proxy.domLoading = false;
                proxy.domLoaded = true;
                if (proxy.needsRedoing) {
                    if (proxy.stylesheets !== undefined) {
                        this.onStylesheets(this);
                    }
                    else {
                        this.onLoadParams(this);
                    }
                }
            }, { once: true });
            return;
        }
        proxy.domLoaded = true;
    }
    async onLoadParams({ fallback, preloadRef, proxy }) {
        const loadParams = { fallback, preloadRef };
        const stylesheet = await this.loadStylesheet(this, loadParams);
        if (stylesheet === true) {
            proxy.needsRedoing = true;
            return; //need to wait
        }
        if (stylesheet === false)
            return;
        const rn = proxy.getRootNode();
        if (stylesheet instanceof HTMLLinkElement) {
            rn.appendChild(stylesheet);
        }
        else {
            rn.adoptedStyleSheets = [stylesheet];
        }
    }
    async onStylesheets({ stylesheets, proxy }) {
        const adoptedStylesheets = [];
        const rn = proxy.getRootNode();
        for (const stylesheet of stylesheets) {
            const adoptedStylesheet = await this.loadStylesheet(this, stylesheet);
            if (adoptedStylesheet === true) {
                proxy.needsRedoing = true;
                return; //need to wait
            }
            if (adoptedStylesheet === false)
                continue;
            if (stylesheet instanceof HTMLLinkElement) {
                rn.appendChild(stylesheet);
            }
            else {
                adoptedStylesheets.push(adoptedStylesheet);
            }
        }
        if (adoptedStylesheets.length > 0)
            rn.adoptedStyleSheets = adoptedStylesheets;
    }
    async loadStylesheet({ proxy, domLoading }, { fallback, preloadRef }) {
        if (preloadRef !== undefined) {
            const link = self[preloadRef];
            if (link !== undefined) {
                return await importCSS(link.href);
            }
            else if (domLoading) {
                return true;
            }
        }
        if (fallback !== undefined) {
            return await importCSS(fallback);
        }
        else {
            return false;
        }
    }
}
const tagName = 'be-loaded';
const ifWantsToBe = 'loaded';
const upgrade = 'style';
define({
    config: {
        tagName,
        propDefaults: {
            upgrade,
            ifWantsToBe,
            forceVisible: true,
            primaryProp: 'preloadRefs',
            virtualProps: ['stylesheets', 'fallback', 'preloadRef']
        },
        actions: {
            onLoadParams: {
                ifKeyIn: ['fallback', 'preloadRef', 'domLoaded'],
            },
            onStylesheets: {
                ifAllOf: ['stylesheets']
            }
        }
    },
    complexPropDefaults: {
        controller: BeLoadedController,
    }
});
