# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Xeno CRM Frontend — Run & QA notes

This workspace contains the Xeno CRM frontend built with React + Vite. The UI was recently polished for spacing, badges, skeletons, timelines and responsive behavior.

Quick start

```bash
cd frontend
npm install --legacy-peer-deps
npm run dev
```

Notes

- If you encounter peer-dependency errors for `lucide-react` with React 19, install with `--legacy-peer-deps` (shown above) or replace the icon library.
- The frontend expects the backend API at `http://127.0.0.1:8000` (see `src/services/api.js`). Start the backend from the project root:

```bash
cd backend
uvicorn app.main:app --reload
```

Accessibility & Responsive checklist (static pass completed)

- Added ARIA labels to key inputs and textareas: `Topbar`, `Customers` search, `CampaignHistory` search, and `AICopilot` prompt.
- Keyboard & focus: major interactive controls are reachable via keyboard; decorative avatars marked `aria-hidden`.
- Responsive layout: `src/App.css` contains breakpoints at `1000px` and `640px` to stack grids and hide the sidebar on narrow screens.

Recommended manual QA steps

1. View at widths: 375px (mobile), 768px (tablet), 1024px (desktop).
2. Tab through main flows: search, pagination, send campaign, AI prompt generation.
3. Run an automated a11y scan locally with `eslint-plugin-jsx-a11y` or a browser extension (Lighthouse, axe).

See `CHANGELOG.md` for details of the latest polish pass.

If you'd like, I can add an `npm` script to run accessibility linting and/or wire up a small responsive test harness next.
