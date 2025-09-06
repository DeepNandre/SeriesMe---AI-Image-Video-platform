## Project Context — SeriesMe v2.0 "Zero-Cost Browser Mode"

### TL;DR
SeriesMe is a dual-mode AI video platform that creates vertical (9:16) talking-head clips from selfies and text. **NEW**: Complete browser-based video generation using Canvas API + MediaRecorder for zero-cost operation, plus optional premium server mode with professional APIs.

### What is this project?
- A privacy-first, consent-driven AI video platform for content creators
- **Dual Architecture**: Free browser mode (Canvas API) + Premium server mode (ElevenLabs + Cloudinary)
- Input: selfie (JPG/PNG ≤10MB) + viral sentence (≤200 chars) + explicit consent
- Output: WebM/MP4 with Ken Burns effects, captions, TTS audio, and watermark
- **Zero-cost default**: No external APIs required for basic functionality

### Architecture overview
**🆓 Browser Mode (Default - Zero Cost)**
- Complete client-side video generation using Canvas API + MediaRecorder
- Ken Burns effect animation engine with professional transitions
- Web Speech API for free text-to-speech synthesis
- WebM export with instant download (no server required)
- Full privacy: no data ever leaves user's browser

**☁️ Server Mode (Optional Premium)**
- Netlify Functions for serverless TTS processing  
- ElevenLabs API integration for professional voice synthesis
- Cloudinary video processing for enhanced quality
- Traditional job queue system with polling

**🎛️ Feature Flag System**
- Runtime toggling between browser/server rendering modes
- Progressive enhancement from free to premium tiers
- Environment-based configuration for deployment flexibility

### User flow & state machine
**🆓 Browser Mode Flow:**
1) User uploads selfie, types sentence, confirms consent
2) Canvas loads image and applies Ken Burns effect keyframes
3) Web Speech API generates TTS audio from text
4) MediaRecorder captures canvas animation + audio synchronously
5) WebM blob created and available for instant download/save
6) No external API calls or server processing required

**☁️ Server Mode Flow (Optional):**
1) User uploads selfie, types sentence, confirms consent
2) Frontend POSTs `/api/generate` → returns `{ jobId }`
3) Frontend polls `/api/status?jobId=` every ~2s until `ready | error`
4) On `ready`, frontend GETs `/api/result?jobId=` with media URLs and shows preview

**State machine (implemented in `src/pages/Create.tsx`):**
`idle → uploading → queued → processing → assembling → ready | error`

**Feature Flag Control:**
```typescript
// Browser mode (default)
VITE_USE_BROWSER_RENDERER=true

// Server mode (premium)
VITE_USE_BROWSER_RENDERER=false
VITE_ENABLE_TTS_ELEVENLABS=true
```

### API contracts (source of truth)
See `face-a-phrase/docs/API_CONTRACTS_FRONTEND.md` for full schemas.
- POST `/api/generate` (multipart: `selfie`, `script`, `consent`) → `202 { jobId }`
- GET `/api/status?jobId=` → `{ status, progress?, etaSeconds?, error? }`
- GET `/api/result?jobId=` → `{ videoUrl, posterUrl, durationSec, width, height }`

### Repository layout (high‑level)
```
/ (repo root)
  face-a-phrase/               # Frontend (Vite + React + TypeScript)
    src/pages/                 # '/', '/create', '/library', '/about', '/privacy'
    src/components/            # UploadDropzone, ProgressStepper, VideoPlayer, etc.
    src/lib/
      api.ts                   # Dual-mode API (browser + server jobs)
      flags.ts                 # Feature flag configuration system
      idb.ts                   # IndexedDB helpers (library storage)
      useOnline.ts            # Offline detection utilities
      render/                  # 🆕 Browser rendering engine
        CanvasComposer.ts      # Ken Burns effect animation engine  
        generateBrowserClip.ts # Main video generation orchestrator
        AudioRecorder.ts       # Web Speech API + audio processing
      future/                  # 🆕 Scaffolding for scaling
        auth.ts               # Authentication system foundation
        payments.ts           # Stripe subscription billing
        cloud-storage.ts      # Cloudinary/S3 integration
        collaboration.ts      # Team features and sharing
        analytics.ts          # Usage tracking and metrics
    src/components/__tests__/   # 🆕 Comprehensive test suite
      ProgressStepper.a11y.test.tsx    # Accessibility compliance
      UploadDropzone.validation.test.tsx # File validation 
      Library.actions.test.tsx          # Keyboard navigation
      VideoPlayer.test.tsx              # Media element config
    docs/                      # 🆕 Complete architecture docs
      ARCHITECTURE.md          # Dual-mode system design
      BACKLOG_OVERVIEW.md      # Implementation status
      UI_ACCEPTANCE_CHECKLIST.md # Production readiness

  netlify/functions/           # 🆕 Serverless backend functions
    tts.ts                     # ElevenLabs TTS integration
    generate.ts, status.ts     # Job management endpoints

  backend/                     # Legacy FastAPI (still available)
    app/main.py                # FastAPI app (CORS, static, endpoints)
    app/pipeline/              # tts, captions, talking_head, assemble
    [previous backend structure remains unchanged]
```

### How to run locally
**🆓 Browser Mode (Zero Setup Required):**
```bash
cd face-a-phrase
npm install
npm run dev
# No backend, APIs, or configuration needed!
# Video generation works entirely in browser
```

**🧪 Run Comprehensive Test Suite:**
```bash
cd face-a-phrase
npm run test  # Accessibility, validation, interaction tests
npm run lint  # TypeScript and ESLint checks
```

**☁️ Server Mode Development:**
```bash
# Option 1: Netlify Functions (serverless)
netlify dev
# Builds frontend and serves `/api/*` from functions

# Option 2: Legacy FastAPI backend  
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8001

# Option 3: Docker
cd backend  
docker compose up --build
```

**🎛️ Configuration Options:**
```bash
# Default: Browser mode (no setup required)
VITE_USE_BROWSER_RENDERER=true

# Premium: Enable server features
VITE_ENABLE_TTS_ELEVENLABS=true
ELEVENLABS_API_KEY=your_key_here

# Development: Enable experimental features
VITE_SHOW_EXPERIMENTAL_BROLL=true
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

### Accessibility & performance ♿
**🏆 WCAG 2.1 AA Compliant with comprehensive test coverage:**
- ARIA live regions for screen reader progress announcements
- Keyboard navigation throughout entire application
- Focus management during state transitions and modal interactions
- High contrast mode and reduced motion preference support
- Comprehensive accessibility test suite covering all components

### What's done (v2.0 Complete Implementation) ✅
**🎨 Frontend (Production Ready)**
- **Pages**: Landing, create workflow, library management, about, privacy
- **Components**: All components with accessibility compliance and test coverage
- **🆕 Browser Rendering Engine**: Complete Canvas API + MediaRecorder pipeline
- **🆕 Feature Flag System**: Runtime toggling between browser/server modes
- **🆕 Ken Burns Animation**: Professional video composition with smooth transitions  
- **🆕 Web Speech Integration**: Free TTS synthesis for zero-cost operation
- **🆕 Comprehensive Testing**: Accessibility, validation, interaction coverage
- **State Management**: Dual-mode API with job tracking and progress monitoring

**☁️ Backend & Infrastructure** 
- **Netlify Functions**: ElevenLabs TTS integration for premium features
- **Legacy FastAPI**: Complete pipeline (TTS, captions, assembly) still available
- **SQLite Storage**: Job management with background processing
- **Docker Setup**: Production-ready containerization

**📚 Documentation & Architecture**
- **🆕 Complete Architecture Docs**: Dual-mode system design and implementation guide
- **🆕 Production Readiness**: All acceptance criteria met and documented
- **🆕 Future Scaffolding**: Auth, payments, cloud storage, collaboration foundations
- **🆕 Context Recovery**: Comprehensive guides for development continuation

### Current Status: 🚀 Production Ready
**✅ Zero-Cost Browser Mode**: Complete video generation without external dependencies
**✅ Premium Server Mode**: Optional enhanced features with professional APIs  
**✅ Accessibility Compliance**: WCAG 2.1 AA with comprehensive testing
**✅ Mobile Optimized**: Touch-friendly responsive design with offline support
**✅ Scalability Foundation**: Future feature scaffolding for growth phases

### Next Steps (Optional Enhancements)
- **Analytics Integration**: User behavior tracking and product metrics
- **Authentication System**: User accounts and personalized libraries  
- **Subscription Billing**: Stripe integration for premium feature monetization
- **Cloud Storage**: Scalable video hosting with CDN delivery
- **Team Features**: Collaborative editing and workspace management

### Key docs (read these next)
**🏗️ Architecture & Implementation:**
- `face-a-phrase/docs/ARCHITECTURE.md` - Complete dual-mode system design
- `face-a-phrase/docs/BACKLOG_OVERVIEW.md` - Production readiness status
- `face-a-phrase/docs/LLM_RECOVERY_FRONTEND.md` - Context recovery guide

**📋 Development & Testing:**
- `face-a-phrase/docs/UI_ACCEPTANCE_CHECKLIST.md` - All requirements ✅ complete
- `face-a-phrase/docs/API_CONTRACTS_FRONTEND.md` - API schemas and validation
- `face-a-phrase/docs/REPO_MAP.md` - File structure and navigation

**📊 Legacy Documentation:**
- `face-a-phrase/docs/FRONTEND_GAP_ANALYSIS.md` - Historical gap analysis  
- `face-a-phrase/docs/FRONTEND_MRD_SUMMARY.md` - Product requirements
- `face-a-phrase/docs/CHANGELOG_UI.md` - Complete development history

**🚀 Future Scaling:**
- `face-a-phrase/src/lib/future/README.md` - Scaffolding for growth phases


