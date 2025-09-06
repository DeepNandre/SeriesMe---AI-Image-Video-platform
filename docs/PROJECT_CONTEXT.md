## Project Context — SeriesMe‑Lite

### TL;DR
SeriesMe‑Lite turns a selfie and one sentence into a short, vertical (9:16) talking‑head clip with captions and a watermark. The repository contains a mobile‑first React (Vite) frontend and a minimal FastAPI backend with an ffmpeg‑based pipeline. Frontend can run fully mocked, or point to the backend via an env toggle.

### What is this project?
- A safe, consent‑first, “instant clip” generator for social media.
- Input: selfie (JPG/PNG ≤10MB) + one sentence (≤200 chars) + consent checkbox.
- Output: 1080×1920 MP4 with TTS audio, burned captions, and a visible watermark.

### Architecture overview
- Frontend: Vite + React + TypeScript + Tailwind + shadcn‑style UI.
  - Local mock API is embedded for zero‑backend development.
  - Netlify serverless mode: `/api/*` proxied to Netlify Functions (no external backend needed).
  - Optional standalone backend (FastAPI) remains available if desired later.

### User flow & state machine
1) User uploads selfie, types sentence, confirms consent.
2) Frontend POSTs `/api/generate` → returns `{ jobId }`.
3) Frontend polls `/api/status?jobId=` every ~2s until `ready | error`.
4) On `ready`, frontend GETs `/api/result?jobId=` with media URLs and shows preview.

State machine (implemented in `src/pages/Create.tsx`):
`idle → uploading → queued → processing → assembling → ready | error`

### API contracts (source of truth)
See `face-a-phrase/docs/API_CONTRACTS_FRONTEND.md` for full schemas.
- POST `/api/generate` (multipart: `selfie`, `script`, `consent`) → `202 { jobId }`
- GET `/api/status?jobId=` → `{ status, progress?, etaSeconds?, error? }`
- GET `/api/result?jobId=` → `{ videoUrl, posterUrl, durationSec, width, height }`

### Repository layout (high‑level)
```
/ (repo root)
  face-a-phrase/               # Frontend (Vite + React)
    src/pages/                 # '/', '/create', '/library', '/about', '/privacy'
    src/components/            # UploadDropzone, ProgressStepper, VideoPlayer, etc.
    src/lib/api.ts             # Mock API + (optional) real backend client
    src/lib/idb.ts             # IndexedDB helpers (library storage)
    docs/                      # FE docs (repo map, gap analysis, API contracts, etc.)

  backend/                     # Backend (FastAPI)
    app/main.py                # FastAPI app (CORS, static, endpoints)
    app/store.py               # SQLite DAO (jobs table)
    app/jobs.py                # Background runner (state updates)
    app/pipeline/              # tts, captions, talking_head (kenburns), assemble
    app/util/                  # ffmpeg + file helpers
    data/                      # uploads, outputs, jobs.sqlite (created at runtime)
    assets/                    # watermark, fonts, endslate (place your assets here)
    requirements.txt, Dockerfile, docker-compose.yml, tests/
```

### How to run locally
Frontend (mock mode):
```
cd face-a-phrase
npm i
npm run dev
```

Backend (local venv):
```
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8001
```

Netlify Functions (serverless) locally:
```
netlify dev
```
This will build the frontend and serve `/api/*` from functions.

Backend (Docker alternative):
```
cd backend
docker compose up --build
```

### Testing
- Frontend unit tests (Vitest + RTL):
```
cd face-a-phrase
npm run test
```
- Backend tests (pytest):
```
cd backend
pytest -q
```

### Storage & media
- SQLite DB at `backend/data/jobs.sqlite` (auto‑created).
- Uploads: `backend/data/uploads/{jobId}`.
- Outputs: `backend/data/outputs/{jobId}/final.mp4` and `poster.jpg`.
- Static media served under `/media/` (e.g., `/media/outputs/{jobId}/final.mp4`).

### Accessibility & performance
- Focus styles and labels across inputs/checkboxes; `aria-live="polite"` for progress.
- Video uses `preload="metadata"` and a 9:16 container for mobile.
- Lighthouse/LCP not baked into CI; run locally and record results in `face-a-phrase/docs/UI_ACCEPTANCE_CHECKLIST.md`.

### What’s done (high‑level)
- Frontend
  - Pages: landing, create (inline progress + preview), library (IndexedDB), about, privacy.
  - Components: UploadDropzone, SeriesTextArea, ConsentCheckbox, ProgressStepper, VideoPlayer, SeriesButton, Navigation.
  - State machine + polling; a11y tweaks; perf improvements; basic tests.
  - API client: mock by default, backend‑ready via `VITE_API_BASE_URL`.
- Backend
  - Endpoints: `/api/generate`, `/api/status`, `/api/result` with CORS and static media.
  - SQLite job store; background runner; pyttsx3 TTS; captions; Ken Burns; ffmpeg assemble; poster.
  - Tests and Docker setup.

### Known limitations / next steps
- Optional ElevenLabs TTS not wired; provide keys if desired.
- SadTalker integration not enabled; current default is Ken Burns fallback.
- No rate limiting/auth; for local use only.
- Run Lighthouse (mobile) and paste results into `UI_ACCEPTANCE_CHECKLIST.md`.

### Key docs (read these next)
- `face-a-phrase/docs/REPO_MAP.md`
- `face-a-phrase/docs/FRONTEND_GAP_ANALYSIS.md`
- `face-a-phrase/docs/FRONTEND_MRD_SUMMARY.md`
- `face-a-phrase/docs/API_CONTRACTS_FRONTEND.md`
- `face-a-phrase/docs/UI_ACCEPTANCE_CHECKLIST.md`
- `face-a-phrase/docs/LLM_RECOVERY_FRONTEND.md`


