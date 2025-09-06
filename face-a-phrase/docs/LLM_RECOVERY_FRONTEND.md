## 🎯 SeriesMe Context Recovery Guide (Frontend)

### 📋 Quick Start Checklist
1. **Architecture Overview**: Read `docs/ARCHITECTURE.md` for dual-mode system design
2. **Implementation Status**: Review `docs/BACKLOG_OVERVIEW.md` for current completion state
3. **Repository Structure**: Check `docs/REPO_MAP.md` for file organization
4. **Create Workflow**: Start with `src/pages/Create.tsx` (main generation pipeline)

### 🏗️ Key Implementation Details

#### **Feature Flag System** (`src/lib/flags.ts`)
```typescript
export const FLAGS = {
  USE_BROWSER_RENDERER: import.meta.env.VITE_USE_BROWSER_RENDERER !== 'false',
  ENABLE_TTS_ELEVENLABS: import.meta.env.VITE_ENABLE_TTS_ELEVENLABS === 'true',
  SHOW_EXPERIMENTAL_BROLL: import.meta.env.VITE_SHOW_EXPERIMENTAL_BROLL === 'true',
} as const;
```

#### **Two-Mode Architecture**
- **🆓 Browser Mode**: Canvas API + MediaRecorder for zero-cost video generation
- **☁️ Server Mode**: Netlify Functions + ElevenLabs + Cloudinary for premium quality

#### **Core Components**
- `UploadDropzone` - File validation with accessibility
- `ProgressStepper` - Real-time status with ARIA live regions  
- `VideoPlayer` - Preview with download/save/share actions
- `CanvasComposer` - Ken Burns effect video composition
- `generateBrowserClip` - Main browser rendering orchestrator

#### **API Layer** (`src/lib/api.ts`)
- Dual-mode API supporting both browser and server rendering
- In-memory job tracking for browser jobs
- Polling system for server job status

### 🚀 Development Workflow

```bash
# Install and start development
npm install
npm run dev

# Run tests (comprehensive suite included)
npm run test

# Type checking and linting
npm run lint
tsc --noEmit
```

### 🎨 Technical Architecture
- **Framework**: Vite + React 18 + TypeScript
- **Routing**: React Router (SPA, not Next.js)
- **State**: Local state + IndexedDB for video library
- **Styling**: Tailwind CSS with mobile-first approach
- **Video**: Canvas API rendering with 9:16 vertical format
- **Accessibility**: WCAG 2.1 AA compliant with comprehensive test coverage

### 📊 Current Status: ✅ Production Ready
- Complete end-to-end video generation pipeline
- Accessibility compliance with comprehensive testing
- Mobile-optimized responsive design  
- Feature flag system for progressive enhancement
- Zero-cost browser mode + optional premium server mode

### 🔧 Configuration
```bash
# Default (free browser mode)
VITE_USE_BROWSER_RENDERER=true
VITE_ENABLE_TTS_ELEVENLABS=false

# Premium server mode (requires API keys)
ELEVENLABS_API_KEY=your_key_here
CLOUDINARY_CLOUD_NAME=your_cloud_name
```

### 📝 Notes
- Video generation works entirely in-browser by default (no backend required)
- Server mode is optional enhancement requiring API keys
- All video processing respects user privacy and consent
- Mobile-first design with vertical 9:16 video format optimization


