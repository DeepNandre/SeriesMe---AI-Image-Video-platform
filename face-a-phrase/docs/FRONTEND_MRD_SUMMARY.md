## Frontend MRD Summary (Implemented)

This app creates short vertical talking-head videos from a selfie and one sentence. It is a Vite + React + TypeScript SPA with Tailwind and shadcn-style components. Backend is not implemented; a mock API simulates job lifecycle.

### Pages
- Landing (`/`): Marketing hero with CTA to `/create`.
- Create (`/create`): Single-screen flow: upload selfie → enter sentence → consent → generate → inline progress → preview.
- Library (`/library`): Lists saved results (currently mocked; to be wired to IndexedDB).
- About (`/about`), Privacy (`/privacy`): Policy and marketing content.

### State machine
- Implemented in `src/pages/Create.tsx` with local state and polling:
  - `idle → uploading → queued → processing → assembling → ready | error`
  - Polls every ~2s via mock API; transitions based on returned `status`.

### Components
- `UploadDropzone`: Validates image type/size; drag-and-drop.
- `SeriesTextArea`: Textarea with counter and help text.
- `ConsentCheckbox`: Custom checkbox with explicit consent copy.
- `ProgressStepper`: Visual stepper with progress bar and ETA.
- `VideoPlayer`: 9:16 container, watermark overlay, download/share hooks.
- `SeriesButton`, `Navigation`, shadcn `ui/*` primitives.

### API stubs (client-side mocks)
- Location: `src/lib/api.ts`
  - `generateVideo(formData)` → `202 { jobId }`
  - `getStatus(jobId)` → staged statuses over time
  - `getResult(jobId)` → static data URL video, poster, duration, 1080×1920

### To be added (hardening)
- zod-typed API wrappers, simple IndexedDB helpers, a11y live region for progress, preload metadata on video, minimal tests for core components, and README/docs alignment.


