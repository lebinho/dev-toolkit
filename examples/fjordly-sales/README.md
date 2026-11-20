# Example: Fjordly Outdoor sales mockup

A mockup for an invented retailer, built with the `toolkit-mockup` skill. All names and numbers are made up.

- `index.html` the finished page. Open it in a browser.
- `content.js` the only file written by hand. It sets `window.MOCKUP`.

Rebuild after editing `content.js`:

```
python skills/toolkit-mockup/scripts/build.py examples/fjordly-sales/content.js examples/fjordly-sales/index.html
```

Check both comment modes (needs `npm i --no-save jsdom`):

```
node skills/toolkit-mockup/tests/smoke.cjs examples/fjordly-sales/index.html
```

What to look at on the page:

1. Two layout variants and a tooltip page, drawn at their true pixel sizes.
2. **Show build labels** switches on a tag on every element: what builds it, its size and position.
3. A decisions list and a build list.
4. **Comment mode**, then **Finish review**, which copies all comments as Markdown to paste to your agent.
