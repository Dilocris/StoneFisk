---
trigger: always_on
---

# Agent Workspace Guidelines
These rules are CRITICAL to follow to ensure project stability and prevent conflicts between agents.
## 1. 🛡️ Structure & Stack Preservation
- **NEVER overwrite an existing project structure** without explicit user permission.
- **CHECK for existing project roots** (e.g., `package.json`, `next.config.ts`, `index.html`) before creating new files.
  - *Example:* If a `renovate-dashboard/` folder exists with a Next.js app, work INSIDE it. Do NOT create a new `index.html` in the root.
- **Respect the Technology Stack**: If you see `next.config.ts`, do NOT propose a Vanilla JS/HTML solution. Adapt to the existing framework.
## 2. ⚠️ Destructive Actions
- **NO Silent Overwrites**: Never use `Overwrite: true` on critical files (`package.json`, `app/page.tsx`, etc.) unless you are 100% sure the user intends to replace the entire file. Use `replace_file_content` or `multi_replace_file_content` for edits.
- **CONFIRM MAJOR CHANGES**: If the user asks for a simple change but your plan involves "Delete everything and start over," STOP and confirm.
## 3. 🔧 Windows & Environment Quirks
- **PowerShell Execution Policies**: On this machine, `npm` and scripts might be blocked in PowerShell.
  - **SOLUTION**: Use `cmd /c "npm ..."` or `npx` if direct execution fails.
- **Local Server**: ES Modules (`type="module"`) require a local server (`python -m http.server` or VS Code Live Server). They do NOT work via `file://`.
## 4. 🧠 Context Awareness
- **Read before you Write**: Always use `list_dir` on the root to understand the *current* state before generating an implementation plan.
- **Check active files**: If the user has a file open (e.g., `README.md`), assume it might be relevant even if not on disk yet (ask the user to save it).

## 5. 📜 Project Log (`docs/project-log.md`)
- **READ FIRST**: Before starting any major task, read `docs/project-log.md` to understand recent changes and context.
- **UPDATE ALWAYS**: After completing a significant intervention (refactor, new feature, pivot), append a brief entry to the log.
  - Format: `## YYYY-MM-DD: Title` followed by `Action`, `Details`, and `Reason`.