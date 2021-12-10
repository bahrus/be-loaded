import { define } from 'be-decorated/be-decorated.js';
import { importCSS } from './importCSS.js';
import { register } from "be-hive/register.js";
export class BeLoadedController {
    #target;
    intro(proxy, target) {
        this.#target = target;
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
    async onLoadParams({ fallback, preloadRef, proxy, removeStyle }) {
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
            rn.adoptedStyleSheets = [stylesheet.default];
        }
        this.doRemoveStyle(this, rn);
    }
    doRemoveStyle({ removeStyle, proxy }, rn) {
        switch (typeof removeStyle) {
            case 'string':
                {
                    const styleToRemove = rn.querySelector(`#${removeStyle}`);
                    if (styleToRemove !== null)
                        styleToRemove.remove();
                }
                break;
            case 'boolean':
                if (removeStyle) {
                    this.#target.remove();
                }
        }
    }
    async onStylesheets({ stylesheets, proxy, removeStyle: styleIdToRemove }) {
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
                adoptedStylesheets.push(adoptedStylesheet.default);
            }
        }
        if (adoptedStylesheets.length > 0)
            rn.adoptedStyleSheets = adoptedStylesheets;
        this.doRemoveStyle(this, rn);
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
            virtualProps: ['stylesheets', 'fallback', 'preloadRef', 'domLoading', 'domLoaded', 'needsRedoing', 'removeStyle'],
            intro: 'intro',
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
register(ifWantsToBe, upgrade, tagName);
