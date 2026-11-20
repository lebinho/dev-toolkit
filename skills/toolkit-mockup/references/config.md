# The `window.MOCKUP` config

Set it in a `content.js` file. The engine reads it and renders the page. All text fields may contain HTML.

```js
window.MOCKUP = {
  title: "Sales Overview Mockups",          // page title, also the key for stored comments
  eyebrow: "Example",                       // small label above the title
  intro: "<p>One or two sentences.</p>",
  notes: [ { title: "What is real", html: "<p>...</p>" } ],   // extra cards under the intro
  legend: [ ["Built-in visual", ""], ["Custom visual", "custom"], ["Needs a new measure", "measure"] ],
  decisionsTitle: "Decisions needed",
  decisions: [ "<b>Layout.</b> A or B?" ],  // up to six
  frames: [ {
    id: "A", eyebrow: "Variant A", title: "KPI left, detail right", note: "One sentence.",
    w: 1920, h: 1080,                       // true canvas size in pixels
    bg: "#E9EEF2",                          // frame background (optional)
    band: false,                            // true gives the section a tinted band
    components: [ {
      id: "A1", name: "KPI card",
      build: "Card (new)",                  // what builds it; words like custom, deneb, vega get the yellow chip
      newItem: true,                        // true adds "new item needed" to the label
      x: 24, y: 100, w: 520, h: 300,        // real pixel position and size inside the frame
      flat: false,                          // true removes the white card behind it
      html: "<div>...</div>"                // string, or function(component) returning a string
    } ]
  } ],
  extras: [ { eyebrow: "Palette", title: "Status colours", html: "<p>...</p>", band: true } ],
  build: {
    title: "What builds each element",
    intro: "One sentence.",
    cols: ["Element", "Built with", "Needs", "Watch out for"],
    rows: [ ["KPI card", "Card (new)", "Existing measure", "No status word"] ]
  }
};
```

## Switches (view controls)

Use them to show options on one frame instead of drawing several: where a selector sits, totals or per day, a level, days shown.

```js
controls: { units: { label: "Show", value: "total", options: [["total", "Total"], ["day", "Per day"]] } },
frames: [ {
  id: "M", controls: ["units"],                 // shows the switch above the frame
  components: function (s) {                    // components can be a function of the state s
    return [ { id: "A1", name: "Chart", x: 0, y: 0, w: 400, h: 300,
      html: function (c, s) { return s.units === "total" ? "..." : "..."; } } ];
  }
} ]
```

- `s` holds one value per control. A component's `html` receives `(component, s)`.
- To draw a switch inside a component, call `MockupEngine.ctl("units", true)` in its `html` (the second argument makes it small).
- A click on a switch re-renders the frames. Comment pins are kept.
- Test every combination of switches for bad values (`NaN`, `undefined`). The smoke test checks that a switch works, not every combination.

## Extra styling and fonts

- `css: "..."` adds your CSS after the engine's. Scope it to your own class names.
- `fontLinks: ["https://..."]` adds stylesheet links (for example web fonts). Leave it out for a page that must load nothing from outside.

## Styling tokens

Override these CSS variables in `css` to match a design system:
`--mk-bg`, `--mk-surface`, `--mk-ink`, `--mk-ink2`, `--mk-line`, `--mk-accent`, `--mk-accent-soft`, `--mk-mark`, `--mk-mark-line`, `--mk-frame-bg`, `--mk-comp-bg`, `--mk-head`, `--mk-body`.

## Rules for the content file

- The text `</script` must not appear in it.
- Component positions are real pixels in the frame, not percentages.
- Frames are scaled to fit the page width (never above 100%). A frame narrower than the page shows at full size.
- Every component and every decision becomes something the user can comment on, so give components clear ids and names.
