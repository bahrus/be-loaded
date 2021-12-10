# be-loaded [WIP]

be-loaded is a web component decorator that allows a web component to import resources configured via index.html, but default to some internally provided resource if the resource configuration is not found.

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
      <style be-loaded=my-web-component-styles></style>
    </my-web-component>
  </body>
</html>
```

If a web component won't load right away, place the link tag outside any shadow DOM, but near the end of the html document, and use lazy as the value of rel:

```html
<body>
  ...
  <link rel=lazy as=stylesheet id=my-web-component-styles href="./my-customized-styles.css">
</body>
```

Defaults to using CSS Module import (does that respect preload without double loading?  Would not be at all surprised if it doesn't, based on how many inconsistencies there are with preload implementations.)

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




