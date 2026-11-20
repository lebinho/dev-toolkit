---
name: toolkit-mockup
description: Use when the user asks to prepare, draft or review a mockup, mock-up, wireframe, prototype or design options for a Power BI report page, a Microsoft Fabric item or app, a web page or web app screen, or any data screen. Builds one commentable HTML page with real numbers, two or three layout variants at true pixel size, a build label on every element, a decisions list and a list of new measures or components needed, then runs a comment-and-iterate loop with the user. Trigger phrases - "prepare a mockup", "mockup", "wireframe", "design options".
---

# toolkit-mockup

Turn "what should this page look like" into one HTML page the user can review and comment on. Every number is real, every element says what will build it, and the review ends with a clear handshake.

This file is the same for any coding agent. Parts that only work in Claude are in `references/claude-artifacts.md`. The same result without them is in `references/standalone.md`.

## When to use it

Use it when the user wants to see options before anything is built: a Power BI report page, a tooltip page, a Fabric item or app screen, a web page, a dashboard. Do not use it to build the real report, app or site. Hand off to the build step when a layout is chosen.

Pick the reference for the target: `references/power-bi.md`, `references/fabric-app.md` or `references/web-page.md`. The workflow below is the same for all of them.

## Workflow

1. **Read what already exists.** A design system, theme, brand guide, existing pages, tickets or decisions in the project. Follow them. The user's words win, then the project's rules, then your choices. Ask only what blocks you.
2. **Get real data first.** Query the data source for the numbers the page will show: the headline, the breakdown, the trend, a ranking. Check them against a total you can verify. If the data cannot be reached, say so and mark every number as invented. Never show personal data (names, emails). In a public example use invented data only.
3. **Look for what the data says.** A flat ranking, many unnamed items, gaps in a series, a measure that does not follow the period filter. These findings change the design. Put them on the page.
4. **Design two or three real alternatives.** Different layouts, not colour changes. Put them on one page, stacked, not in tabs, so comment pins never sit on hidden content.
5. **Draw every frame at true size.** Use the real canvas of the target (see `references/power-bi.md`). Work in real pixel coordinates and scale to fit. Show each element's size and position.
6. **Label every element.** What visual or component builds it, and whether it needs a new measure, field or API. Never promise what the target cannot do. If a visual cannot do something (colour by status, wrap long text), say so in the build list.
7. **Mark what is a proposal.** Anything not taken from a standard (a colour, a size, a threshold) is a proposal and is labelled so.
8. **Put the decisions first.** A short list (up to six) of what the user must decide, each with the facts that matter.
9. **Add a build list.** One table: element, built with, what it needs, what to watch out for. New measures or components are model or code changes, so list them in one place and get approval before making any.
10. **Publish or open the page, then wait.** Tell the user how to comment (see below).
11. **Comment loop.** Comments are a queue until the user says they are done. Do not change the page while the user is still commenting. When they are done, read every comment, change the page once, and tell them what changed and what you did not change.
12. **Hand off.** When a layout is chosen, write the build brief for the target (for Power BI see `references/power-bi.md`). Record decisions where the project keeps them.

## Build the page

The engine in `assets/` renders the page from one config object. You write the content, not the engine.

1. Write a `content.js` that sets `window.MOCKUP` (fields in `references/config.md`).
2. Build one self-contained file: `python scripts/build.py content.js out.html`. If Python is not available, paste `assets/engine.css`, the content and `assets/engine.js` into `assets/shell.html` by hand (replace `{{CSS}}`, `{{CONTENT}}`, `{{ENGINE}}`, `{{TITLE}}`).
3. Check it: `npm i --no-save jsdom` then `node tests/smoke.cjs out.html`. This checks both comment modes. It does not check how the page looks, so open it in a browser, or ask the user to.
4. Use a neutral look unless the project has a design system. Override the `--mk-*` colour tokens in the content file to match one.

A complete example is in the repo at `examples/fjordly-sales/`. Copy its structure.

## Comments: two modes, same result

The page detects its mode when it opens.

| | Native mode (the host offers comments) | Standalone mode (any browser) |
|---|---|---|
| Add a comment | Host comment mode, or the Comment button on a component | Press Comment mode, click an element, type |
| Where comments live | The host's comment store | The browser (localStorage) |
| Finish | The Finish button sends one message that wakes the agent | The Finish button copies all comments as Markdown. The user pastes them to the agent |
| Agent reads them | Through the host's comment tools | From the pasted Markdown |

In both modes the handshake is the same: the user says they are done, the agent reads all comments, changes the page once, replies.

Tell the user at the start: a plain comment is a queue and does not notify you. Only the Finish button or a message in chat does.

## Rules

- Real numbers only, checked against a known total. Say which period and filter they use.
- No promise the target cannot keep. Check limits (point counts, colour rules, fonts) before drawing.
- Colour is never the only signal. Pair status colours with a symbol and a word. Check contrast of text and of marks.
- Proposals are labelled as proposals.
- Do not change the page while the user is commenting.
- Keep project-specific material (brand colours, logos, names, paths) out of this skill and out of any shared example.
- Plain language. Short sentences.

## Files in this skill

- `assets/` engine (`engine.css`, `engine.js`) and `shell.html`
- `scripts/build.py` assembles the page
- `tests/smoke.cjs` checks both comment modes
- `references/config.md` the `window.MOCKUP` fields
- `references/power-bi.md` canvas sizes, visual limits, build brief
- `references/fabric-app.md` starter notes for Fabric items and apps
- `references/web-page.md` starter notes for web pages and web app screens
- `references/claude-artifacts.md` Claude-only features and how to use them
- `references/standalone.md` the same result in any other agent
