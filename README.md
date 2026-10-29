
# Flowspace

A personal workspace for managing projects, tasks, priorities, and progress — built with React and TypeScript.

## Overview

Flowspace is a frontend-first project and task management application designed to help you organize your work in one place. It includes a project dashboard, a Kanban task board, workspace analytics, configurable settings, and local data persistence.

## Features

- **Dashboard** — Workspace summaries, project status, and recently updated projects.
- **Project management** — Create, edit, and delete projects with descriptions, statuses, colors, and optional due dates.
- **Task management** — Organize tasks across To do, In progress, and Done columns.
- **Task details** — Set priorities, descriptions, project associations, and optional due dates.
- **Analytics** — View project and task metrics, status distributions, priorities, overdue tasks, and upcoming deadlines.
- **Workspace settings** — Customize the workspace name, description, and default task settings.
- **Data persistence** — Retain projects, tasks, and preferences using browser-local storage.
- **Workspace backup** — Export workspace data as a versioned JSON file.
- **Workspace reset** — Reset workspace data through a confirmation flow.
- **Responsive navigation** — Navigate the workspace across desktop and narrower screens.

## Technology Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS v4
- React Router
- Zustand
- Vitest
- Testing Library
- ESLint

## Getting Started

### Prerequisites

- Node.js
- npm
- Git

### Installation

Clone the repository:

```bash
git clone https://github.com/Biniam777/flowspace.git
cd flowspace
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the local URL printed by Vite in your terminal.

## Quality Checks

Run TypeScript checks:

```bash
npx tsc --noEmit
```

Run linting:

```bash
npm run lint
```

Run automated tests:

```bash
npm run test:run
```

Create a production build:

```bash
npm run build
```

## Data and Privacy

Flowspace currently stores workspace data in the browser using local storage.

- Data is local to the browser and origin being used.
- Data does not automatically synchronize between devices or browsers.
- Clearing browser storage can remove saved workspace data.
- Export a JSON backup before resetting or clearing workspace data.

Authentication, a backend API, cloud synchronization, and multi-user collaboration are outside the current version's scope.

## Deployment

Flowspace can be deployed as a Vite application on Vercel.

The repository includes a `vercel.json` rewrite configuration for client-side routing. Configure Vercel to use:

- **Framework:** Vite
- **Build command:** `npm run build`
- **Output directory:** `dist`

After deployment, test the live site, including direct navigation to application routes.

## Future Improvements

- Additional accessibility and responsive testing
- Further task-board usability improvements
- Potential backend persistence and account support in a future version

## Author

**Biniam**

GitHub: [@Biniam777](https://github.com/Biniam777)

---

Built as a personal portfolio project.
