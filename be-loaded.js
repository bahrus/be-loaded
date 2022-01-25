import { define } from 'be-decorated/be-decorated.js';
import { importCSS } from './importCSS.js';
import { register } from "be-hive/register.js";
export class BeLoadedController {
    #target;
    intro(proxy, target) {
        this.#target = target;
        if (document.readyState !== 'loading') {
            console.log(target, 'readyState =' + document.readyState);
            proxy.domLoading = true;
            document.addEventListener('DOMContentLoaded', e => {
                console.log(target, 'DOMContentLoaded');
                proxy.domLoading = false;
                proxy.domLoaded = true;
                if (proxy.needsRedoing) {
                    console.log(target, 'needsRedoing');
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
        console.log({ fallback, preloadRef, proxy }, 'onLoadParams');
        const loadParams = { fallback, preloadRef };
        const stylesheet = await this.loadStylesheet(this, loadParams);
        if (stylesheet === true) {
            proxy.needsRedoing = true;
            console.log('needs redoing', { fallback, preloadRef, proxy });
            return; //need to wait
        }
        if (stylesheet === false) {
            console.log('stylesheet is false', { fallback, preloadRef, proxy });
            return;
        }
        const rn = proxy.getRootNode();
        if (stylesheet instanceof HTMLLinkElement) {
            rn.appendChild(stylesheet);
        }
        else {
            rn.adoptedStyleSheets = [stylesheet.default];
        }
        console.log('stylesheet is loaded', { fallback, preloadRef, proxy });
        this.doRemoveStyle(this, rn);
        // setTimeout(() => {
        //     this.doRemoveStyle(this, rn);
        // }, 20);
    }
    doRemoveStyle({ removeStyle, proxy }, rn) {
        console.log('doRemoveStyle', { removeStyle, proxy });
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
        console.log('onStylesheets', { stylesheets, proxy, removeStyle: styleIdToRemove });
        const adoptedStylesheets = [];
        const rn = proxy.getRootNode();
        for (const stylesheet of stylesheets) {
            const adoptedStylesheet = await this.loadStylesheet(this, stylesheet);
            if (adoptedStylesheet === true) {
                proxy.needsRedoing = true;
                console.log('needs redoing', { stylesheets, proxy, removeStyle: styleIdToRemove });
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
        console.log('stylesheets are loaded', { stylesheets, proxy, removeStyle: styleIdToRemove });
        this.doRemoveStyle(this, rn);
    }
    async loadStylesheet({ proxy, domLoading }, { fallback, preloadRef }) {
        console.log('loadStylesheet', { proxy, domLoading, fallback, preloadRef });
        if (preloadRef === undefined) {
            throw 'preloadRef is required';
        }
        const link = self[preloadRef];
        if (link !== undefined) {
            console.log('link is defined', { proxy, domLoading, fallback, preloadRef });
            return await importCSS(link.href);
        }
        else if (domLoading) {
            console.log('link is undefined, domLoading still', { proxy, domLoading, fallback, preloadRef });
            return true;
        }
        if (fallback !== undefined) {
            const preloadLink = document.createElement("link");
            preloadLink.href = fallback;
            preloadLink.id = preloadRef;
            preloadLink.rel = "preload";
            preloadLink.as = "script";
            preloadLink.crossOrigin = "anonymous";
            document.head.appendChild(preloadLink);
            console.log('link is undefined, fallback is defined', { proxy, domLoading, fallback, preloadRef });
            return await this.loadStylesheet(this, { fallback, preloadRef });
        }
        else {
            console.log('link is undefined, fallback is undefined', { proxy, domLoading, fallback, preloadRef });
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
            forceVisible: ['style'],
            primaryProp: 'preloadRefs',
            virtualProps: ['stylesheets', 'fallback', 'preloadRef', 'domLoading', 'domLoaded', 'needsRedoing', 'removeStyle'],
            intro: 'intro',
        },
        actions: {
            onLoadParams: {
                ifKeyIn: ['fallback', 'preloadRef', 'domLoaded'],
            },
            onStylesheets: 'stylesheets'
        }
    },
    complexPropDefaults: {
        controller: BeLoadedController,
    }
});
register(ifWantsToBe, upgrade, tagName);
