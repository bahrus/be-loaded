# be-loaded

be-loaded is a web component decorator that allows a web component to import CSS configured via index.html, but default to some internally provided CSS if the resource configuration is not found.

## Stylesheets

Example 1.


```html
<html>
  <head>
    <link rel=preload as=stylesheet id=my-web-component-styles href="./my-customized-styles.css">
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
  <link rel=lazy as=stylesheet id=my-web-component-styles.css href="./my-customized-styles.css">
</body>
```

It is best to include some dashes in the id, so the id doesn't conflict with any global JavaScript constants the application may be using.

*be-loaded* defaults uses CSS Module import for Chromium-based browsers, and inserts a link rel=stylesheet tag for non-chromium browsers (for now).

I am quite pleased to report that, contrary to my expectations, CSS Module imports don't double download the stylesheet found in a link rel=preload!  Here's to hoping Firefox and Safari follow suit when they get to it.



Due to current [skypack limitation](https://github.com/skypackjs/skypack-cdn/issues/107), can only work with fully qualified CSS Paths when using a skypack based CDN.


If no link tag is found, then throws an error.


Example 2.  Fallback to a default stylesheet.

```html
<link rel=preload as=stylesheet id=my-web-component-styles href="./my-customized-styles.css">
...
<my-web-component>
  #Shadow DOM
  <style be-loaded='{
    "fallback": "./my-default-styles.css",
    "preloadRef": "my-web-component-styles"
  }'></style>
</my-web-component>
```

Example 3.  Multiple stylesheets:

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




