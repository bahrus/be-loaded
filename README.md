# be-loaded

be-loaded is a web component decorator that allows:

1) a web component to import CSS configured via index.html, but default to some internally provided CSS if the resource configuration is not found.
2) a JSON import to follow a similar pattern. [TODO]

## Stylesheets

Example 1.


```html
<html>
  <head>
    <link rel=preload as=script id=my-web-component-styles.css href="./my-customized-styles.css">
  </head>
  <body>
    ...
    <my-web-component>
      #Shadow DOM
      <style be-loaded=my-web-component-styles.css></style>
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

*be-loaded* defaults uses CSS Module import for Chromium-based browsers, and inserts a link rel=stylesheet tag for non-chromium browsers (for now).

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
  <style be-loaded='{
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
<link rel=preload as=stylesheet id=my-web-component-styles href="./my-customized-styles.css">
<link rel=preload as=stylesheet id=your-web-component-styles href="./your-customized-styles.css">
<my-web-component>
  #Shadow DOM
  <style be-loaded='
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

## JSON [TODO]

```html

<link rel=preload as=script id=my-web-component-config href="./my-customized-config.json">
<my-web-component>
  #Shadow DOM
  <script type=application/json be-loaded=my-web-component-config>
    "my-sub-component": {

    }
  </script>
  <my-sub-component -prop1></my-sub-component>
</my-web-component>
```

## XSLT [TODO]




