# be-loaded [WIP]

<a href="https://nodei.co/npm/be-loaded/"><img src="https://nodei.co/npm/be-loaded.png"></a>

[![How big is this package in your project?](https://img.shields.io/bundlephobia/minzip/be-loaded?style=for-the-badge)](https://bundlephobia.com/result?p=be-loaded)

<img src="http://img.badgesize.io/https://cdn.jsdelivr.net/npm/be-loaded?compression=gzip">

be-loaded is a web component decorator / behavior that allows:

1)  Declarative imports of CSS Modules without JavaScript.
2)  A web component consumer can choose to override the default CSS Module, without incurring any penalty from bundling the original CSS Module with the web component definition.
3)  Fallback on a default CDN if no mapping is provided.
4)  JSON and XSLT imports following similar patterns.

Much or all of this could be accomplished, perhaps, with import maps alone, once they land in all browsers, and with [polyfills in the interim](https://github.com/guybedford/es-module-shims).

And in fact, import maps is one of the two mechanisms be-loaded leans heavily on.

But be-loaded also allows for an alternative / supplementary mechanism for managing theme overrides, via link rel=preload and/or link rel=lazy for less aggressive preemptive downloads (with the help of [be-preemptive](https://github.com/bahrus/be-preemptive)). 

## Stylesheets

Example 1.


```html
<html>
  <head>
    <link be-preemptive rel=preload as=script id=my-web-component/my-web-component-styles.css href="./my-customized-styles.css" crossorigin=anonymous>
  </head>
  <body>
    ...
    <my-web-component>
      #Shadow DOM
      <style  be-loaded=my-web-component/my-web-component-styles.css></style>
    </my-web-component>
  </body>
</html>
```

If a web component won't load right away, place the link tag outside any shadow DOM, but before the first instance the web component appears, and use lazy as the value of rel:

```html
<body>
  ...
  <link be-preemptive rel=lazy be-preemptive as=script id=my-web-component/my-web-component-styles.css href="./my-customized-styles.css">
</body>
```

It is best to include some dashes and/or periods in the id, so the id doesn't conflict with any global JavaScript constants the application may be using.

## Integration with import maps

Perhaps more importantly, it is suggested that the id match the same syntax that import maps uses.  This way, be-loaded can do the following:

1.  Look for a link tag as shown above.  If found, use the resolved href to perform the CSS Module import (or fetch for browsers that aren't there yet.)
2.  If not found, try doing a dynamic import with assert: {type: 'css'} of that id.  This relies on import maps to allow for dependency injection of theme overrides.
3.  If that fails, try the fallback CDN, described below.


*be-loaded* uses CSS Module import for Chromium-based browsers, and inserts a link rel=stylesheet tag for non-chromium browsers (for now). [TODO - figure out how to do this via feature testing].

I am quite pleased to report that, contrary to my expectations, CSS Module imports don't double-download the stylesheet found in a link rel=preload!  Here's to hoping Firefox and Safari follow suit when they get to it.


### Fallback to a default stylesheet

So what if the web component is used in an environment where no link tag is provided, nor an import map, such as a bundling environment, or an environment that simply won't follow your instructions, despite your best efforts?  We have two ways to go:  

1.  Try to resolve to the local co-located file.  As far as bundling, this will most likely require a plug-in.  Most bundling solutions are totally focused around JS files, and I suspect will soon provide support for bundling that has this JavaScript:

```JavaScript
import styles from "./my-web-component-styles.css" assert { type: "css" };
```

But to my knowledge there isn't an established equivalent pattern established for declarative solutions, as we are pursuing.  So that's a [TODO] item for this component.  Hopefully such a convention will be established somehow by some white knight (in the "pure" sense) somewhere.

One easy solution in the absence of such a solution is for the may-it-be transpiler to provide an option to output a "bundled" version of the component, inlining the styles, which means no opportunities to override the styles without a serious penalty. [TODO]

2.  Resolve to a hardcoded cdn path.

be-loaded, by default, employs option 2, using jsdelivr as the CDN.  To use a different CDN, set the "CDNFallback" property to the base URL of the CDN.  be-loaded will again create a link tag in the header with the mapping, as a signal to other instances:

```html
<link be-preemptive rel=lazy as=script id=my-web-component/my-web-component-styles.css href="./my-customized-styles.css">
...
<my-web-component>
  #Shadow DOM
  <style  be-loaded='{
    "CDNFallback": "https://unpkg.com/",
    "path": "my-web-component/my-web-component-styles.css",
    "version": "1.0.0",
    "removeStyle": true
  }'></style>
</my-web-component>
```

If a version is provided it is inserted before the first slash as @1.0.0 in this case.

### Avoiding FOUC

One disadvantage of external css references is that it can interfere with the ability to [render while streaming](https://www.youtube.com/watch?v=3sMflOp5kiQ).  be-loaded imposes no blocking, but then we are back to the question of how to avoid FOUC.

In some scenarios, it is best to display a minimal UI, or no UI at all, while the stylesheet is loading.  While the stylesheet is loading, we could have a slot through which the light children can display unfettered by any manipulation by the web component, for example.  But in some cases, it may be possible to provide some minimal styling that makes the stream / rendering acceptable (like the basic color scheme), and apply various styles like a layer cake as they come in.  

One feature be-loaded provides To help with this, is specifying "removeStyle": true.  Once the CSS imports are done and added, *be-loaded* will delete the style tag be-loaded is decorating.  We can alternatively specify another style tag to delete by setting it to the id of that style tag, via "removeStyle": "style-id-to-remove".



## Support for Media Queries [TODO]

## JSON

A Javascript api is available for importing JSON:

```TypeScript
export async function importJSON(preloadRef: string, fallbackUrl: string): Promise<any>
```

It provides a similar service to the CSS support listed above, but it can only be invoked programmatically.

## XSLT [TODO]




