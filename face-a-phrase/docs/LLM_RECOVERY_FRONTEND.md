## If you lost context, start here (Frontend)

1) Read `docs/REPO_MAP.md` to understand structure and dependencies.
2) Read `docs/FRONTEND_GAP_ANALYSIS.md` for current status and planned fixes.
3) Open the create flow: `src/pages/Create.tsx` (state machine + polling).
4) Review components under `src/components/*` (UploadDropzone, SeriesTextArea, ConsentCheckbox, ProgressStepper, VideoPlayer).
5) Review mock API: `src/lib/api.ts` (in-memory jobs). Typed wrappers will be added in `src/lib/api.ts` with zod schemas.
6) Run the app:

```
npm i
npm run dev
```

7) Lint/typecheck (optional):

```
npm run lint
tsc --noEmit
```

Notes:
- This is a Vite + React SPA (not Next.js). Routes are handled via React Router inside `src/App.tsx`.
- Target UI is mobile-first with a 9:16 preview in `VideoPlayer`.
- Do not add a real backend here; use the mock API during development.


