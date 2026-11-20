# Brief for an agent: create a demo example

Use this brief to ask any coding agent to make a new example page for the `toolkit-mockup` skill, for example one for a different domain or a Fabric app. Paste the block below into the agent. Fill in the two lines in brackets.

---

You are working in the repository `dev-toolkit`. Create a new demo example for the skill `toolkit-mockup`.

Domain: [for example "a hospital bed-occupancy dashboard" or "a Fabric app for approving data access requests"]
Target: [Power BI report page | Fabric item or app]

Steps:

1. Read `AGENTS.md`, then `skills/toolkit-mockup/SKILL.md`, then `skills/toolkit-mockup/references/config.md`. Read `references/power-bi.md` or `references/fabric-app.md` for the target. Look at `examples/fjordly-sales/content.js` and copy its structure.
2. Create `examples/<short-name>/content.js` that sets `window.MOCKUP`. Include: an intro, two real layout alternatives plus one small frame (a tooltip page or a state of the app), at true pixel size; at least eight components with build labels; three to six decisions; a build list with at least five rows that names limits of the target; two notes.
3. Use invented data only. Use a small seeded random generator so the numbers are the same on every build. Use invented company and people names that are clearly fictional. No real brand, no real person, no real data.
4. Do not use any colour from a real company's brand. Use the default neutral look, or invent a palette.
5. Build the page: `python skills/toolkit-mockup/scripts/build.py examples/<short-name>/content.js examples/<short-name>/index.html`.
6. Test it: `npm i --no-save jsdom`, then `node skills/toolkit-mockup/tests/smoke.cjs examples/<short-name>/index.html`. Every check must pass.
7. Add `examples/<short-name>/README.md` in the style of `examples/fjordly-sales/README.md`.
8. Add one row for the example to the README of the repository.

Check before you finish (tick each one in your answer):

- [ ] No real company, brand, person, email, path or number appears in any new file.
- [ ] The page opens from a local file with no server and loads no script from outside.
- [ ] Every component has an id, a name, a build label and a size.
- [ ] Every claim in the build list about a limit of the target is one you are sure of. If you are not sure, say "check" in the text.
- [ ] Colour is never the only signal: every status has a symbol and a word.
- [ ] Text uses plain language and short sentences. No em dash.
- [ ] The smoke test passes.

Do not commit or push. Tell the user which files you created and what to look at.

---

Notes for the person who runs it:

- To make a screenshot or video of the demo, open `index.html` in a browser, press **Comment mode**, add two or three comments, then press **Finish review**.
- To publish a live demo, enable GitHub Pages for the repository and link the page from the README.
