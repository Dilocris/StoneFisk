# Style Guide & Color System

## Current Color Logic
| Function | Context | Current Color | Tailwind Class |
| :--- | :--- | :--- | :--- |
| **Primary Action** | Buttons, Links, Today Marker | Blue | `blue-500`, `blue-600` |
| **Completed / Paid** | Task Status, Expense Status | Emerald | `emerald-500` |
| **In Progress / Deposit** | Task Status, Expense Status | Amber | `amber-500` |
| **Pending** | Task Status (Gantt) | Blue | `blue-500` |
| **Pending** | Task Status (Dropdown) | Slate | `slate-500` |
| **Blocked / Delay** | Task Status, Alerts | Rose | `rose-500` |
| **Background** | App Background | White / Dark Slate | `white` / `slate-900` |
| **Card Surface** | Widget Backgrounds | White / Dark Slate | `white` / `slate-900` |
| **Text Main** | Headings, Body | Slate | `slate-800` / `white` |
| **Text Muted** | Subtitles, Metadata | Slate | `slate-500` / `slate-400` |

## Proposed Harmonious Palette (Dark Theme Aligned)
To achieve a more premium and harmonious look, we will move away from the default high-saturation Tailwind colors to a curated set of CSS variables defined in `globals.css`.

### Core Palette (Cosmic/Midnight Inspiration)
This palette uses deep background with vibrant but sophisticated accents.

| Semantic Name | Hex Code (Dark) | Description |
| :--- | :--- | :--- |
| `--background` | `#0f1117` | Very deep blue-grey, almost black. Richer than pure black. |
| `--card` | `#1e212b` | Slightly lighter, distinct from background. |
| `--border` | `#2f3342` | Low contrast border for subtle separation. |
| `--primary` | `#6366f1` | **Indigo**. modern, tech-focused primary action color. |
| `--success` | `#10b981` | **Emerald**. Kept but slightly adjusted or used with opacity for glow. |
| `--warning` | `#f59e0b` | **Amber**. refined for visibility on dark. |
| `--danger` | `#f43f5e` | **Rose**. specific shade for alerts. |
| `--info` | `#3b82f6` | **Blue**. Used sparingly for functional info. |
| `--text-main` | `#e2e8f0` | Slate 200. High readability. |
| `--text-muted` | `#94a3b8` | Slate 400. Non-intrusive. |

### Status Mapping
| Status | New Variable | Color Family |
| :--- | :--- | :--- |
| **Completed / Paid** | `var(--success)` | Emerald/Teal |
| **In Progress / Deposit** | `var(--warning)` | Amber/Orange |
| **Pending** | `var(--text-muted)` | Slate (Neutral) - moved away from Blue for "waiting" |
| **Blocked / Late** | `var(--danger)` | Rose/Red |

### UI Implementation Plan
1.  **Define CSS Variables**: Update `src/app/globals.css` with the new palette.
2.  **Update Components**: Replace `bg-blue-500`, `text-emerald-600` etc., with custom classes or arbitrary values using the variables (e.g., `bg-[var(--primary)]` or configuring tailwind theme extension).
    *   *Strategy*: Extend Tailwind config to map `primary`, `success`, `warning`, `danger` to these variables so we can use `bg-primary`, `text-success` etc.

## Tailwind Configuration Update
We will update `src/app/globals.css` (and potentially `tailwind.config.ts` if it existed, but here we use v4 `theme` directive in css) to define these colors.

```css
@theme {
  --color-background: #0f1117;
  --color-surface: #1e212b;
  --color-surface-highlight: #292d3e;
  --color-border: #2f3342;
  
  --color-primary: #6366f1; /* Indigo 500 */
  --color-primary-dark: #4f46e5;
  --color-primary-light: #818cf8;

  --color-success: #10b981; /* Emerald 500 */
  --color-warning: #f59e0b; /* Amber 500 */
  --color-danger: #f43f5e; /* Rose 500 */
  --color-neutral: #64748b; /* Slate 500 */
}
```
