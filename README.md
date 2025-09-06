# SeriesMe: AI-Image-Video-platform

## Backend (FastAPI) — local run
## SeriesMe — AI Image → Video (Lite)

Create vertical (9:16) talking‑head clips from a selfie and one sentence. Mobile‑first UI, safe/consent‑first copy, watermark, captions. Runs fully on Netlify (frontend + serverless functions), with an optional standalone FastAPI backend available for future needs.

### What’s in this repo
- Frontend: Vite + React + TypeScript + Tailwind + shadcn‑style components
- Serverless API (Netlify Functions): mock job lifecycle that satisfies the FE contracts
- Optional Backend (FastAPI): full ffmpeg pipeline (Ken Burns, captions, TTS) if you ever want a dedicated API
- Docs: repo map, gap analysis, contracts, MRD summary, acceptance checklist, project context

### Monorepo layout
```
face-a-phrase/            # Frontend (Vite React)
  src/pages/              # '/', '/create', '/library', '/about', '/privacy'
  src/components/         # UploadDropzone, ProgressStepper, VideoPlayer, etc.
  src/lib/api.ts          # API client (Netlify functions by default)
  src/lib/idb.ts          # IndexedDB helpers for Library
  docs/                   # FE docs (map, gap analysis, contracts, etc.)

netlify/
  functions/              # generate.ts, status.ts, result.ts (mock API)

backend/                  # Optional FastAPI backend (containerized)
  app/                    # FastAPI app + ffmpeg pipeline (Ken Burns)
  data/, assets/          # Runtime media, watermark/fonts (when used)

docs/PROJECT_CONTEXT.md   # One‑page project context for new teammates
netlify.toml              # Build + /api/* redirect to Netlify Functions
```

### Run locally (Netlify serverless mode)
```
npm i -g netlify-cli   # if not installed
netlify dev
```
This builds the frontend and serves `/api/*` from Netlify Functions. Open the printed local URL.

### Deploy to Netlify (recommended)
- Connect this GitHub repo in Netlify
- Build command: `cd face-a-phrase && npm i && npm run build`
- Publish directory: `face-a-phrase/dist`
- Functions directory: `netlify/functions` (already set in `netlify.toml`)
- No env vars required for the mock pipeline

### API contracts (source of truth)
Frontend expects these endpoints (fulfilled by Netlify Functions):
- `POST /api/generate` → `202 { jobId }`
- `GET /api/status?jobId=` → `{ status, progress?, etaSeconds?, error? }`
- `GET /api/result?jobId=` → `{ videoUrl, posterUrl, durationSec, width, height }`
See `face-a-phrase/docs/API_CONTRACTS_FRONTEND.md` for types/zod.

### What’s done
- Pages: landing, create (inline progress + preview), library, about, privacy
- Components: UploadDropzone, SeriesTextArea, ConsentCheckbox, ProgressStepper, VideoPlayer, SeriesButton, Navigation
- State machine + polling aligned with MRD
- Accessibility: labels, focus rings, `aria-live` for progress
- Performance: lazy bits, video `preload="metadata"`, 9:16 container
- Library: IndexedDB helpers; save action from preview
- Tests (Vitest + RTL): core components
- Netlify functions: generate/status/result to satisfy FE contracts
- Anchor docs for LLM recovery and onboarding (`docs/*`)

### What’s remaining / roadmap
- Swap mock media with real generation (either)
  - Keep Netlify serverless: use cloud TTS (e.g., ElevenLabs) + object storage (R2/S3) + background functions
  - Or use the optional FastAPI backend (ffmpeg pipeline) on a container host (Fly/Render)
- PWA basics (manifest/service worker) if desired
- Lighthouse Mobile scores: record in `face-a-phrase/docs/UI_ACCEPTANCE_CHECKLIST.md`
- Optional SadTalker talking‑head mode if we go with the dedicated backend

## 🚀 Ready to Launch - Choose Your Deployment

SeriesMe is now production-ready with **two deployment options**:

### Option 1: Netlify-Only (Recommended) ⚡
**Complete serverless deployment - everything runs on Netlify!**

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy)

- ✅ **Zero Setup**: Deploy with one click
- ✅ **Serverless**: No servers to manage
- ✅ **Auto-scaling**: Handles traffic spikes automatically
- ✅ **Cost Effective**: Pay only for what you use

**Quick Start**:
```bash
# Just deploy to Netlify - that's it!
# See NETLIFY_DEPLOYMENT.md for full guide
```

### Option 2: Netlify + Separate Backend
**Traditional setup with dedicated backend service**

```bash
# Backend
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8001

# Frontend  
cd face-a-phrase
echo 'VITE_API_BASE_URL=http://localhost:8001' > .env.local
npm install && npm run dev
```

See `DEPLOYMENT.md` for full backend deployment guide.

## Architecture Comparison

| Feature | Netlify-Only | Netlify + Backend |
|---------|-------------|-------------------|
| **Setup** | 1-click deploy | Manual backend setup |
| **Scaling** | Auto-scales | Manual scaling |
| **Cost** | Pay-per-use | Always-on server costs |
| **Maintenance** | Zero maintenance | Server maintenance |
| **Video Processing** | Cloud services | Local FFmpeg |
| **Best For** | Most users | High-volume/custom needs |

## What's New ✨

- 🆕 **Netlify-Only Option**: Complete serverless deployment
- ✅ **Real Video Generation**: Full TTS + Ken Burns + captions pipeline  
- ✅ **Cloud Services**: ElevenLabs TTS + Cloudinary video processing
- ✅ **Background Functions**: 15-minute processing timeouts
- ✅ **Auto-scaling**: Handles any traffic volume
- ✅ **Production Ready**: Both deployment options fully functional

### Helpful links
- **Deployment Guide**: `DEPLOYMENT.md` (start here for production)
- Project context: `docs/PROJECT_CONTEXT.md`
- Repo map and components: `face-a-phrase/docs/REPO_MAP.md`
- API contracts: `face-a-phrase/docs/API_CONTRACTS_FRONTEND.md`
- Frontend analysis: `face-a-phrase/docs/FRONTEND_GAP_ANALYSIS.md`
