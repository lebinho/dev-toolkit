# Instructions for coding agents

This repository holds skills for development work: Power BI, Microsoft Fabric, web pages and more. A skill is a folder `skills/<name>/` with a `SKILL.md`.

## How to use a skill

1. Find the skill whose `description` (in the front matter of its `SKILL.md`) matches what the user asked for.
2. Read that `SKILL.md` completely. Follow its steps in order.
3. Read the files it points to (`references/`, `assets/`) only when a step needs them.
4. If a step needs a feature your tool does not have, use the `standalone` reference of that skill instead. Do not skip the step.
5. Never put data from the user's project into this repository. Examples use invented data only.

## Skills

| Skill | Use it when the user asks for |
|---|---|
| `skills/toolkit-mockup` | a mockup, wireframe, prototype or design options for a Power BI page, a Fabric item or app, or a data screen |

## If you are changing this repository

- Keep file names lowercase with hyphens.
- Keep every skill agent-neutral. Put tool-specific steps in their own reference file and describe a fallback.
- Run the smoke test after changing the mockup engine: `npm i --no-save jsdom`, then `node skills/toolkit-mockup/tests/smoke.cjs examples/fjordly-sales/index.html`. Rebuild the example first with `python skills/toolkit-mockup/scripts/build.py examples/fjordly-sales/content.js examples/fjordly-sales/index.html`.
- No company names, people's names, logos or real data in any file.
