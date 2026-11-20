# Web page and web app notes for mockups

Starter notes. Extend them as you use the skill for web work.

## What the engine does well here

- Shows layout intent at true pixel size, with a label on every element and a way to comment on any part.
- Lets a component hold real HTML and CSS, so you can show the actual look, not boxes.

## What it does not do

The engine places components at fixed pixel coordinates. A real web page reflows. So the page shows layout at chosen widths, not the reflow itself. Say in the page how the layout changes between widths.

## Frames: one per width that matters

Common starting points (check the audience's real devices):

| Frame | Size |
|---|---|
| Desktop | 1440 x 900 |
| Tablet | 768 x 1024 |
| Phone | 390 x 844 |

For each frame, a short note: what stacks, what hides, what stays fixed.

## Real content

Use real copy, real product names and real numbers from the source. Lorem ipsum hides length, wrapping and empty-state problems. If the real copy does not exist yet, write plausible copy and label it "draft copy".

## Comment on parts of a component

A component is one comment target by default. To comment on a part inside it, add these attributes to the inner element:

```html
<h2 data-comment-target data-uid="A1-headline" data-label="A1 headline">...</h2>
```

`data-uid` must be unique on the page. `data-label` is what the comment export shows.

## What to label

- The component or library part that builds it (for example "Card, design system", "Hero image, asset needed", "Form, new").
- What it needs that does not exist: copy, images, icons, data, an endpoint, an owner.

## What to check

| Question | Why it matters |
|---|---|
| Body text at least 16 px, line height about 1.5? | Readability on phones. |
| Text and background contrast, and contrast of icons and borders? | Accessibility. Never use colour alone for state. |
| Focus order and visible focus? | Keyboard users. |
| Which images and fonts are needed, and how heavy are they? | Page speed. |
| What does each state look like: empty, loading, error, long text? | These are the frames people forget. |
| Does the design use the project's design system and tokens? | Follow them if they exist. |

## Hand-off

When a layout is chosen: the tokens used (colours, type scale, spacing), the component list, the asset list, and the notes on how it changes between widths.
