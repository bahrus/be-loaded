import { define } from 'be-decorated/be-decorated.js';
import { register } from 'be-hive/register.js';
import('be-preemptive/be-preemptive.js');
export class BeLoaded extends EventTarget {
    #insertStylesheet(rn, linkOrStylesheet) {
        if (linkOrStylesheet instanceof HTMLLinkElement) {
            rn.appendChild(linkOrStylesheet);
        }
        else {
            rn.adoptedStyleSheets = [...rn.adoptedStyleSheets, linkOrStylesheet.default];
        }
        this.proxy.resolved = true;
    }
    async onPath({ path, proxy, CDNFallback, version }) {
        const link = self[path];
        const rn = proxy.getRootNode();
        if (link !== undefined && (link.matches(`[be-preemptive`) || link.matches(`[is-preemptive]`))) {
            let linkOrStylesheetPromise = link?.beDecorated?.preemptive?.linkOrStylesheetPromise;
            if (linkOrStylesheetPromise !== undefined) {
                linkOrStylesheetPromise.then((linkOrStylesheet) => {
                    this.#insertStylesheet(rn, linkOrStylesheet);
                });
            }
            else {
                link.addEventListener('be-decorated.preemptive.link-or-stylesheet-promise-changed', e => {
                    linkOrStylesheetPromise = e.detail.value;
                    linkOrStylesheetPromise.then((linkOrStylesheet) => {
                        this.#insertStylesheet(rn, linkOrStylesheet);
                    });
                }, { once: true });
            }
        }
        else {
            //try doing an import and rely on import maps for dependency injection
            const { importCSS } = await import('be-preemptive/importCSS.js');
            const result = await importCSS(path, true);
            switch (typeof result) {
                case 'string':
                    switch (result) {
                        case 'SyntaxError':
                        //no support for import maps either for now (not sure which will come first with firefox/safari)
                        //do same thing as simply not found?
                        case '404':
                            const versionedPath = version !== undefined ? path.replace('/', '@' + version + '/') : path;
                            const linkOrStylesheet = await importCSS(CDNFallback + versionedPath);
                            this.#insertStylesheet(rn, linkOrStylesheet);
                            break;
                    }
                    break;
                case 'object':
                    if (result instanceof HTMLLinkElement) {
                        rn.appendChild(result);
                    }
                    else {
                        rn.adoptedStyleSheets = [...rn.adoptedStyleSheets, result.default];
                    }
            }
        }
        this.doRemoveStyle(this, proxy.getRootNode());
    }
    doRemoveStyle({ removeStyle, proxy }, rn) {
        switch (typeof removeStyle) {
            case 'string':
                {
                    const styleToRemove = rn.querySelector(`#${removeStyle}`);
                    if (styleToRemove !== null)
                        styleToRemove.innerHTML = '';
                }
                break;
            case 'boolean':
                if (removeStyle) {
                    proxy.self.innerHTML = '';
                }
                break;
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
            virtualProps: ['CDNFallback', 'path', 'version', 'removeStyle'],
            primaryProp: 'path',
            proxyPropDefaults: {
                CDNFallback: 'https://cdn.jsdelivr.net/npm/',
            },
        },
        actions: {
            onPath: 'path',
        },
    },
    complexPropDefaults: {
        controller: BeLoaded,
    },
});
register(ifWantsToBe, upgrade, tagName);
