import { define } from 'be-decorated/be-decorated.js';
import { importCSS } from './importPolyfill.js';
export class BeLoadedController {
    async onLoadParams({ fallback, preloadRef, stylesheets, proxy }) {
        const loadParams = { fallback, preloadRef };
        const stylesheet = await this.loadStylesheet(this, loadParams);
        proxy.getRootNode().adoptedStyleSheets = [stylesheet];
    }
    async onStylesheets({ stylesheets, proxy }) {
        const adoptedStylesheets = [];
        for (const stylesheet of stylesheets) {
            const adoptedStylesheet = await this.loadStylesheet(this, stylesheet);
            adoptedStylesheets.push(adoptedStylesheet);
        }
        proxy.getRootNode().adoptedStyleSheets = adoptedStylesheets;
    }
    async loadStylesheet({ proxy }, { fallback, preloadRef }) {
        if (preloadRef !== undefined && self[preloadRef] !== undefined) {
            const link = self[preloadRef];
            const stylesheet = await importCSS(link.href);
            return stylesheet;
        }
        else if (fallback !== undefined) {
            const stylesheet = await importCSS(fallback);
            return stylesheet;
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
                ifKeyIn: ['fallback', 'preloadRef'],
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
