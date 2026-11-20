# Fabric item and app notes for mockups

Starter notes, not yet tested on a real project. Extend them the first time you use the skill for a Fabric app.

## What to draw

- One frame per screen or state, at the real window size you design for. Include the states people forget: empty, loading, error, no permission, long text.
- Navigation: where it sits, how many levels, what is selected.
- Forms: fields, validation, the one primary action per area.

## What to label on each element

- The component it will use (control, card, table, chart, form).
- The data it reads or writes: item, table, query or API, and whether it is read only.
- Who may see or change it (roles, row-level rules, workspace permissions).
- What it needs that does not exist yet: a table, a column, an endpoint, a function.

## What to check before you draw it

| Question | Why it matters |
|---|---|
| Where does the data come from, and how fresh is it? | A screen that promises live data on a daily refresh misleads. |
| Which identity runs the call? | The signed-in user, an app identity or a service account change what the screen can show. |
| Are there limits on rows, calls or time? | Decides paging, loading states and what a chart can show. |
| Are the controls and fonts available in the target? | Mockups in HTML can promise things the framework cannot do. |
| Who owns each new item? | New tables, endpoints and functions need an owner and approval. |

## Build list columns

Element, built with, reads or writes, needs (new), watch out for.

## Hand-off

When a screen is chosen, write the brief for the build step: screens, states, data bindings, permissions, new items. Record decisions where the project keeps them.
