## Repo Map

This project is a Vite + React + TypeScript SPA using Tailwind and a small shadcn-style component layer. It is structured to be backend-ready via a mock API in `src/lib/api.ts` and typed wrappers.

### Framework and key dependencies (from package.json)

```
React 18, Vite 5, TypeScript 5
TailwindCSS 3, tailwindcss-animate
Radix UI primitives (@radix-ui/*)
Lucide icons (lucide-react)
React Hook Form + @hookform/resolvers
TanStack React Query 5 (installed, not currently used)
Zod 3
React Router DOM 6
Shadcn-style utilities: class-variance-authority, tailwind-merge, sonner
Build tooling: @vitejs/plugin-react-swc
Linting: ESLint 9 (typescript-eslint), react-hooks, react-refresh
```

### Directory tree (depth 2–3)

```
/ (project root)
  face-a-phrase/
    public/
      favicon.ico
      placeholder.svg
      robots.txt
    src/
      pages/
        Index.tsx           # landing '/'
        Create.tsx          # create flow '/create'
        Library.tsx         # library '/library'
        About.tsx           # '/about'
        Privacy.tsx         # '/privacy'
        NotFound.tsx?       # present in layout snapshot under pages, not read here
      components/
        UploadDropzone.tsx
        SeriesTextArea.tsx
        ConsentCheckbox.tsx
        ProgressStepper.tsx
        VideoPlayer.tsx
        SeriesButton.tsx
        Navigation.tsx
        ui/                 # shadcn-style primitives
          button.tsx, dialog.tsx, ...
      hooks/
        use-toast.ts
        use-mobile.tsx
      lib/
        api.ts             # mock API (in-memory jobs)
        utils.ts
      App.tsx
      main.tsx
      index.css
    tailwind.config.ts
    vite.config.ts
    eslint.config.js
    package.json
    README.md
```

### Pages and routes

- `/` → `src/pages/Index.tsx`
- `/create` → `src/pages/Create.tsx`
- `/library` → `src/pages/Library.tsx`
- `/about` → `src/pages/About.tsx`
- `/privacy` → `src/pages/Privacy.tsx`
- 404 handling depends on router setup in `App.tsx` (React Router). No Next.js App Router.

### UI building blocks

- **Upload**: `src/components/UploadDropzone.tsx`
- **Textarea**: `src/components/SeriesTextArea.tsx`
- **Consent**: `src/components/ConsentCheckbox.tsx`
- **Progress**: `src/components/ProgressStepper.tsx`
- **Video Player**: `src/components/VideoPlayer.tsx`
- **Buttons/Toasts**: `src/components/SeriesButton.tsx`, `src/hooks/use-toast.ts`, `src/components/ui/sonner.tsx`

### API mocks and return shapes

- Location: `src/lib/api.ts`
  - `generateVideo(formData)` → `{ jobId: string }`
  - `getStatus(jobId)` → `{ status: 'queued'|'processing'|'assembling'|'ready'|'error', progress?: number, etaSeconds?: number, error?: string }`
  - `getResult(jobId)` → `{ videoUrl: string, posterUrl: string, durationSec: number, width: number, height: number }`
  - Uses in-memory `Map` to simulate job progression.

### Lint/Test setup and Tailwind config

- **ESLint**: `eslint.config.js` (typescript-eslint, react-hooks, react-refresh). No Prettier config.
- **Tests**: none configured yet (adding Vitest + RTL in hardening pass).
- **Tailwind**: `tailwind.config.ts` with theme extensions (colors via CSS vars, 9:16 aspect, tokens), `index.css` includes base styles.

### Helpful commands (current SPA)

```
npm i
npm run dev
npm run lint
tsc --noEmit
```

Note: Next.js commands like `npx next build` and App Router route scans do not apply; this project uses Vite + React Router.


