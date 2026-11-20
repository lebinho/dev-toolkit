# Power BI notes for mockups

Starter notes. Extend them as you learn what a target can and cannot do.

## Canvas sizes

- Report page: 1920 x 1080 (Full HD) for new reports, 1280 x 720 (HD) for older ones. Keep the size of an existing report unless a resize is agreed.
- Tooltip page: a small custom size, for example 480 to 560 wide. Set it in the page settings.
- Draw frames at that size in real pixel coordinates. Use a grid, for example margin 32, gutter 24, snap 8.

## Font sizes

Power BI font sizes are in points. On screen, 1 pt is about 1.33 px. A 14 pt label is about 18.7 px. Check text does not overflow its visual before you promise it.

## Page structure

A common structure is 3-30-300: the answer in 3 seconds (top left), the comparison in 30 seconds, the detail in 300 seconds (drill or table). Keep slicers and logos out of the top-left corner so it holds the answer.

## What to check before you draw it

| Question | Why it matters |
|---|---|
| Can the visual colour by a measure or status? | The built-in KPI visual cannot show a status word or reason. A waterfall colours by increase or decrease only. |
| How many points can it draw? | The built-in scatter chart shows 3,500 points by default (10,000 if raised). |
| Does it support log scales, gaps in a line, or constant lines? | Decides whether a trend or scatter can be built without a custom visual. |
| Is a custom visual allowed? | Many organisations allow only certified visuals. Ask which. |
| Does the measure follow the period filter? | A measure built on the date filter shows the wrong value on a tooltip that compares two periods. Build a measure per period. |
| Can the link between two tables filter? | A missing or inactive relationship means you cannot show a per-item attribute from another table. |
| Does a tooltip page work on this visual? | Custom visuals may not support report page tooltips. |
| Do text symbols exist in the font? | Symbols in a measure are Unicode characters. The theme font may lack them. |

## Statuses and colour

Never use colour alone. Pair each status with a symbol and a word. Check text contrast, and check marks (dots, lines) against the background. Light fills such as yellow fail on white, so give them a dark outline and a label.

## Build brief (hand-off to the build step)

When a layout is chosen, write a short brief for whoever builds the report. For each page: its role, the canvas, a grid, each element's id, visual type, position and size, the fields or measures it uses, and which new measures are needed. If the project uses a report authoring tool or a design-brief format, follow that format.

## Data checks that belong in the mockup

- Show the exact period and filters behind every number.
- State what is excluded (days with no data, items in only one period).
- List every new measure in the build list. A new measure is a model change. Get approval first.
