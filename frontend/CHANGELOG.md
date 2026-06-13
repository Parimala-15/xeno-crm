# Changelog — Frontend polish pass

Date: 2026-06-13

Summary

Completed a visual polish pass focused on spacing, badges, skeletons, timelines, AI chat UI, and chart polish while preserving all backend APIs and business logic.

Highlights

- Polished global styles and tokens: updated `src/App.css` with skeleton shimmer, empty states, status badges, timeline, AI bubbles, and table density.
- KPI improvements: `src/components/KpiCard.jsx` now shows clear trend arrows and percentage deltas.
- Loading states: `src/components/LoadingSkeleton.jsx` provides shimmer placeholders across charts and lists.
- Activity feed: `src/components/ActivityFeed.jsx` uses status badges and improved icon containers.
- AI workspace: `src/pages/AICopilot.jsx` now renders chat-style bubbles, skeletons, and audience estimates.
- Pages updated: Campaigns, CampaignHistory, Analytics, Customers updated for badges, timeline visuals, and executive summary.
- Accessibility: minor ARIA and input label improvements in `src/components/Topbar.jsx` and `src/components/Sidebar.jsx`.
- Charts: colors switched to CSS variables/tokens for consistent theming.

Files modified (representative)

- frontend/src/App.css
- frontend/src/components/KpiCard.jsx
- frontend/src/components/LoadingSkeleton.jsx
- frontend/src/components/ActivityFeed.jsx
- frontend/src/pages/AICopilot.jsx
- frontend/src/pages/Campaigns.jsx
- frontend/src/pages/CampaignHistory.jsx
- frontend/src/pages/Analytics.jsx
- frontend/src/pages/Customers.jsx
- frontend/src/components/Sidebar.jsx
- frontend/src/components/Topbar.jsx

Run locally

```bash
cd frontend
npm install --legacy-peer-deps
npm run dev
```

Notes

- If you hit dependency resolution errors for `lucide-react` on React 19, use the `--legacy-peer-deps` flag (shown above) or replace the icon package.
- Next recommended steps: run the responsive QA pass and finalize `frontend/README.md` with dependency notes.
