# The same result in any agent

You need no Claude feature. You need a way to write files and, ideally, run a script.

## Steps

1. Do the workflow in `SKILL.md` up to building the page.
2. Write `content.js` and build `out.html` with `scripts/build.py` (or by hand, see `SKILL.md`).
3. Tell the user to open the file in a browser. A local file works. The page detects that no host is present and turns on its own comment layer.
4. The user presses **Comment mode**, clicks any element, types, and saves. Pins show where. Comments stay in the browser.
5. When finished, the user presses **Finish review**. The page copies all comments as Markdown. If copying is blocked it shows the text in a box to copy by hand. The **Download .md** button saves a file.
6. The user pastes the Markdown into the chat with the agent and says they are done.
7. The agent reads every comment, changes `content.js` once, rebuilds, and answers in chat: what changed, what did not, and why.

## What the Markdown looks like

```
# Review comments: Sales Overview Mockups

2 comment(s). Each heading names the element the comment is about.

## A1 KPI card
- (1) Make the number bigger

## Decision 2
- (2) Keep the colours but add a legend
```

Each heading is the label of the element, so the agent knows what each comment is about.

## Limits

- Comments live in one browser. A different browser or a cleared cache loses them. Copy them out before leaving.
- There is no live link to the agent. The handshake is the paste.
- Sharing the page with another reviewer means each reviewer sends their own Markdown.

## Hosting the page

Any static place works: a local folder, a file share, an internal web page. The page needs no server and loads nothing from outside. Fonts fall back to system fonts unless you add your own.
