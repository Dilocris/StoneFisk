# StoneFisk Dashboard

StoneFisk is a local-first renovation management dashboard for tracking budget, tasks, assets, suppliers, and progress notes.

## Features
- Budget tracking with paid vs pending breakdowns
- Gantt-style schedule with delay indicators
- Expense, task, asset, and supplier management
- PDF report export
- File attachments (stored locally)

## Local-First Storage
This project stores data on the local filesystem for personal use only:
- Data: `data/db.json`
- Uploads: `public/uploads/`

Both paths are ignored by git in `.gitignore` so personal data is not committed.

## Getting Started

```bash
npm install
npm run dev
```

Open `http://localhost:3000` in your browser.

## Scripts
- `npm run dev` — start the dev server
- `npm run build` — build for production
- `npm run start` — start the production server
- `npm run lint` — lint

## License
MIT