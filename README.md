# dev-toolkit

One home for agent-neutral skills, templates and examples for development work: Power BI, Microsoft Fabric, web pages and more.

Plain Markdown and HTML that any coding agent which can read files and write files can follow. Claude Code loads the skills natively, and the layout follows what Codex reads. Nothing here depends on one vendor.

## Status

Early. One skill exists today. The rest below is planned, not built.

**Planned** (in no fixed order): Power BI report authoring and review skills, semantic model and DAX helpers, Fabric item workflows, web and app design skills, reusable prompt templates. New skills are added as they are used on real work and proven.

## What is inside today

| Skill | What it does |
|---|---|
| [`toolkit-mockup`](skills/toolkit-mockup/SKILL.md) | Prepares a mockup for a Power BI report page, a Fabric item or app, a web page or any data screen. One HTML page with real numbers, layout variants at true pixel size, a build label on every element, a decisions list, a build list, and a comment-and-iterate loop. Target notes: Power BI, Fabric app, web page. |

More skills will follow. Every skill is named `toolkit-<name>`, so typing `/toolkit` in Claude Code lists them all.

## See it

Open [`examples/fjordly-sales/index.html`](examples/fjordly-sales/index.html) in a browser. It is a mockup for an invented retailer. Press **Comment mode**, click a component, write a comment, then press **Finish review** to copy the comments as Markdown.

GitHub shows HTML as source. Download the file or clone the repo, or turn on GitHub Pages for this repo to get a live link.

## Use a skill

**Claude Code.** Put the skill folder where Claude Code looks for skills, for example `~/.claude/skills/toolkit-mockup`. A folder link (a junction on Windows, a symlink elsewhere) keeps one copy in sync with this repo:

```
# Windows (cmd)
mklink /J "%USERPROFILE%\.claude\skills\toolkit-mockup" "C:\path\to\dev-toolkit\skills\toolkit-mockup"

# macOS and Linux
ln -s /path/to/dev-toolkit/skills/toolkit-mockup ~/.claude/skills/toolkit-mockup
```

Then ask: "prepare a mockup for ...". The repo also has a `.claude-plugin/plugin.json`, so it can later be installed as a plugin.

**Codex.** Codex reads skills with the same layout (a folder with a `SKILL.md` that has `name` and `description`, plus optional `scripts/`, `references/`, `assets/`). It looks in `.agents/skills` in the repository and its parent folders, and in `$HOME/.agents/skills`, and it follows symlinks. So link the skill folder there:

```
# macOS and Linux
ln -s /path/to/dev-toolkit/skills/toolkit-mockup ~/.agents/skills/toolkit-mockup

# Windows (PowerShell)
New-Item -ItemType Junction -Path "$HOME\.agents\skills\toolkit-mockup" -Target "C:\path\to\dev-toolkit\skills\toolkit-mockup"
```

Start it with `$toolkit-mockup` or by describing the task. The Codex documentation and some community guides disagree on the personal folder (`~/.agents/skills` against `~/.codex/skills`), so check which one your installed version uses. This was written from the Codex documentation, not tested in Codex yet.

**Other agents.** Point the agent at `AGENTS.md` (or copy its content into your agent's instruction file). It tells the agent to read `skills/<name>/SKILL.md` and follow it. The skills do not need any Claude feature: each one has a `standalone` reference that gives the same result without it.

## How the skills are written

- One `SKILL.md` per skill with the workflow in plain steps.
- Anything that only works in one tool lives in its own reference file, next to a fallback that works anywhere.
- Examples use invented data only.
- Skills are tested where they can be. The mockup engine has a smoke test (`skills/toolkit-mockup/tests/smoke.cjs`, needs `jsdom`).

## Contributing

Issues and pull requests are welcome. Keep to these rules: no company data, names or logos in any file, plain language, no features that need one specific tool unless a fallback is described, and a test or a checklist for anything that can be tested.

## Licence

[MIT](LICENSE)
