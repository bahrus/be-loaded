# be-loaded [WIP]

be-loaded is a web component decorator / behavior that allows:

1) a web component to import CSS configured via the head tag of index.html (typically), but default to some internally provided CSS if no such configuration is found.
2) a JSON import to follow a similar pattern. 

If the web component's internally provided CSS is also a separate file that is to be imported, then one important goal of the be-loaded decorator is that the web component consumer can adopt an alternative theme for the component without incurring any penalty from the default styles the component provides.

## Stylesheets

Example 1.


```html
<html>
  <head>
    <link rel=preload as=script id=my-web-component/my-web-component-styles.css href="./my-customized-styles.css" crossorigin=anonymous>
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
  <link rel=lazy as=script id=my-web-component/my-web-component-styles.css href="./my-customized-styles.css">
</body>
```

It is best to include some dashes and/or periods in the id, so the id doesn't conflict with any global JavaScript constants the application may be using.

## Integration with import maps [TODO]

Perhaps more importantly, it is suggested that the id match the same syntax that import maps uses.  This way, be-loaded can do the following:

1.  Look for a link tag as shown above.
2.  If not found, try doing a dynamic import with assert: {type: 'css'} of that id.
3.  If that fails, try the fallback stylesheet, described below.


*be-loaded* uses CSS Module import for Chromium-based browsers, and inserts a link rel=stylesheet tag for non-chromium browsers (for now). [TODO - figure out how to do this via feature testing].

I am quite pleased to report that, contrary to my expectations, CSS Module imports don't double download the stylesheet found in a link rel=preload!  Here's to hoping Firefox and Safari follow suit when they get to it.

### Avoiding FOUC

In some scenarios, it is best to display a minimal UI, or no UI at all, while the stylesheet is loading.  While the stylesheet is loading, we could have a slot through which the light children can display unfettered by any manipulation by the web component, for example.

To help with this, specify "removeStyle": true.  Once the CSS imports are done and added, *be-loaded* will delete the style tag be-loaded is decorating.  We can alternatively specify another style tag to delete by setting it to the id of that style tag, via "removeStyle": "style-id-to-remove".



### Fallback to a default stylesheet

So what if the web component is used in an environment where no link tag is provided, nor an import map, such as a bundling environment, or an environment that simply won't follow your instructions, despite your best efforts?  We have two ways to go:  

1.  Try to resolve to the local co-located file.  As far as bundling, this will most likely a plug-in.  Most bundling solutions are totally focused around JS files, and I suspect will soon provide support for bundling that has this JavaScript:

```JavaScript
import styles from "./my-web-component-styles.css" assert { type: "css" };
```

But to my knowledge there isn't an established equivalent pattern established for declarative solutions, as we are pursuing.  So that's a [TODO] item for this component.  One easy solution in the absence of such a solution is for the may-it-be transpiler to provide an option to output a "bundled" version of the component, inlining the styles, which means no opportunities to override the styles without a serious penalty. [TODO]

2.  Resolve to a hardcoded cdn path.

be-loaded, by default, employes option 2, using jsdelivr as the CDN.  To use a different CDN, set the "CDNFallback" property to the base URL of the CDN.  be-loaded will again create a link tag in the header with the mapping, as a signal to other instances.

Example 2. 

```html
<link rel=preload as=script id=my-web-component/my-web-component-styles.css href="./my-customized-styles.css">
...
<my-web-component>
  #Shadow DOM
  <style  be-loaded='{
    "CDNFallback": "https://unpkg.com/",
    "ref": ["my-web-component", "version", "/my-web-component-styles.css"],
    "version": "1.0.0",
    "removeStyle": true
  }'></style>
</my-web-component>
```

 
### Multiple stylesheets [TODO]

Example 3. 

```html
<link rel=preload as=script id=my-web-component-styles href="./my-customized-styles.css">
<link rel=preload as=script id=your-web-component-styles href="./your-customized-styles.css">
<my-web-component>
  #Shadow DOM
  <style  be-loaded='
  {
    "stylesheets": [
      {
        "fallback": "./my-default-styles.css",
        "preloadRef": "my-web-component-styles"
      },
      {
        "fallback": "./your-default-styles.css",
        "preloadRef": "your-web-component-styles"
      }
    ]
  }'
  ></style>
</my-web-component>
```





## Support for Media Queries [TODO]

## JSON

A Javascript api is available for importing JSON:

```TypeScript
export async function importJSON(preloadRef: string, fallbackUrl: string): Promise<any>
```

It provides a similar service to the CSS support listed above, but it can only be invoked programmatically.

## XSLT [TODO]




