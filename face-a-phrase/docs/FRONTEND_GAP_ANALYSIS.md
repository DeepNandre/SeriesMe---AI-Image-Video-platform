## Frontend Gap Analysis

| Area | Status | File(s) | Notes / Fix plan |
| --- | --- | --- | --- |
| Pages: landing | Present | `src/pages/Index.tsx` | OK. Consider lazy-loading non-critical visuals for LCP. |
| Pages: create | Present | `src/pages/Create.tsx` | Implements flow; add aria-live to progress; wire save-to-library. |
| Pages: progress inline | Present | `src/pages/Create.tsx`, `src/components/ProgressStepper.tsx` | Works; add ARIA live region and test. |
| Pages: preview | Present | `src/pages/Create.tsx`, `src/components/VideoPlayer.tsx` | Add `<video preload="metadata">`, ensure 9:16 container. |
| Pages: library | Present (mock) | `src/pages/Library.tsx` | Replace mock with `lib/idb.ts` helpers. |
| Pages: about | Present | `src/pages/About.tsx` | OK. |
| Pages: privacy | Present | `src/pages/Privacy.tsx` | OK. |
| State machine | Present (in component) | `src/pages/Create.tsx` | `idle → uploading → queued → processing → assembling → ready | error`. Add `validating` stage pre-submit for UX polish. |
| Components: UploadDropzone | Present | `src/components/UploadDropzone.tsx` | Add tests for type/size validation. |
| Components: TextArea | Present | `src/components/SeriesTextArea.tsx` | OK. |
| Components: ConsentCheckbox | Present | `src/components/ConsentCheckbox.tsx` | Add `aria-checked` and label `id/for`. |
| Components: ProgressStepper | Present | `src/components/ProgressStepper.tsx` | Add `role="status"` and `aria-live="polite"`. |
| Components: VideoPlayer | Present | `src/components/VideoPlayer.tsx` | Add `preload="metadata"`; expose `onSave` prop; write tests. |
| Components: Button/Toast | Present | `src/components/SeriesButton.tsx`, `src/hooks/use-toast.ts` | OK. |
| Accessibility | Needs polish | various | Add focus-visible rings, ARIA live region, ensure labels. |
| Performance | Needs polish | various | Preload metadata on video; lazy-load heavy components; verify LCP/CLS via Lighthouse. |
| Storage: IndexedDB | Missing | `src/lib/idb.ts` (to add) | Implement minimal `get/set/del/keys` + wire Library. |
| API contracts (mocked) | Present (client-only) | `src/lib/api.ts` | Add zod schemas + typed wrappers `generateClip`, `pollStatus`, `getResult`. |
| PWA basics | Missing | n/a | Optional; skip for now. |
| Design tokens | Present | `tailwind.config.ts`, `index.css` | Tokens via CSS vars; ensure contrast on primary. |
| Copy: consent/watermark | Present | Consent text + watermark overlay | OK. |


