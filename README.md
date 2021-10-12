# be-loaded [TODO]

Turn hyperlink url into a web component.

```html
<a href="https://..." name=my-external-content be-loaded>My External Content</a>
```

generates:

```html
<a href="https://..." name=my-external-content is-loaded>My External Content</a>
<my-external-content>
    #shadow
      content retrieved from My External Content
</my-external-content>
```

