# be-loaded

be-loaded is a web component decorator that allows:

1) a web component to import CSS configured via index.html, but default to some internally provided CSS if the resource configuration is not found.
2) a JSON import to follow a similar pattern. [TODO]

## Stylesheets

Example 1.


```html
<html>
  <head>
    <link rel=preload as=script id=my-web-component-styles.css href="./my-customized-styles.css" crossorigin=anonymous>
  </head>
  <body>
    ...
    <my-web-component>
      #Shadow DOM
      <style  be-loaded=my-web-component-styles.css></style>
    </my-web-component>
  </body>
</html>
```

If a web component won't load right away, place the link tag outside any shadow DOM, but near the end of the html document, and use lazy as the value of rel:

```html
<body>
  ...
  <link rel=lazy as=script id=my-web-component-styles.css href="./my-customized-styles.css">
</body>
```

It is best to include some dashes and/or periods in the id, so the id doesn't conflict with any global JavaScript constants the application may be using.

*be-loaded* uses CSS Module import for Chromium-based browsers, and inserts a link rel=stylesheet tag for non-chromium browsers (for now).

I am quite pleased to report that, contrary to my expectations, CSS Module imports don't double download the stylesheet found in a link rel=preload!  Here's to hoping Firefox and Safari follow suit when they get to it.

### Avoiding FOUC

In some scenarios, it is best to display a minimal UI, or no UI at all, while the stylesheet is loading.  While the stylesheet is loading, we could have a slot through which the light children can display unfettered by any manipulation by the web component, for example.

To help with this, specify "removeStyle": true.  Once the CSS imports are done and added, *be-loaded* will delete the style tag be-loaded is decorating.  We can alternatively specify another style tag to delete by setting it to the id of that style tag, via "removeStyle": "style-id-to-remove".



### Fallback to a default stylesheet

Example 2. 

```html
<link rel=preload as=script id=my-web-component-styles href="./my-customized-styles.css">
...
<my-web-component>
  #Shadow DOM
  <style  be-loaded='{
    "fallback": "./my-default-styles.css",
    "preloadRef": "my-web-component-styles",
    "removeStyle": true
  }'></style>
</my-web-component>
```

Due to current [skypack limitations](https://github.com/skypackjs/skypack-cdn/issues/107), the fallback can only work with fully qualified CSS Paths when using a skypack-based CDN.
 
If using a JSON attribute, the preloadRef now becomes optional.

### Multiple stylesheets

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

### Importing Static, Declarative HTML Web Components [TODO]

With the advent of declarative Shadow DOM, many useful web components that require little to no js could be less taxing on the browser if they were imported as pre-rendered HTML rather than JavaScript.

The intent of declarative shadowDOM, I think, is to allow it to be used in the context of an HTML stream.  Still, a case can be made that to benefit from caching, lazy loading, etc, in some cases it is better to reference the HTML via client-side fetch.  There are a few tricky issues to consider though:

How to specify this while also indicating what the light children and attribute settings should be.  be-loaded helps with this.

The shadowroot attribute seems to have no effect when the HTML is inserted into the DOM tree post initial render.  

**NB:** There might not be an appropriate link-preload-as combination that works properly with HTML currently.  Anyway.


```html
<my-ssr-component be-loaded='{
  "fallback": "https://esm.run/my-ssr-component/my-ssr-component.html",
}'>
<!-- light children -->
</my-ssr-component>
```

What this does:

1.  If customElements.get('my-ssr-component') is undefined, it will fetch the HTML from the fallback URL.  Otherwise, full stop.
2.  Searches for a template with attribute shadowroot=open, and if if finds it, sets the shadowRoot
3.  Strips the outer tag if it is my-ssr-component.
      1.  Copies the attributes of the outer tag to the target.



## Support for Media Queries [TODO]

## JSON

A Javascript api is available for importing JSON:

```TypeScript
export async function importJSON(preloadRef: string, fallbackUrl: string): Promise<any>
```

It provides a similar service to the CSS support listed above, but it can only be invoked programmatically.

## XSLT [TODO]




