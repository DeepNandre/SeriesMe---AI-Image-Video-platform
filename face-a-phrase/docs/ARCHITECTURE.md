# 🏗️ SeriesMe Technical Architecture

## 🎯 Overview
SeriesMe is a dual-mode AI video platform that creates talking-head style videos from user selfies and text input. The architecture supports both free browser-based rendering and optional premium cloud processing.

## 🏛️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (React + Vite)                  │
├─────────────────────────────────────────────────────────────┤
│  📱 UI Components    │  🎨 Video Player    │  📊 Progress   │
│  • UploadDropzone   │  • Canvas Composer  │  • Live Status │
│  • SeriesTextArea   │  • MediaRecorder    │  • ETA Display │
│  • ConsentCheckbox  │  • Ken Burns FX     │  • Error Alert │
└─────────────────────────────────────────────────────────────┘
                                │
                    ┌───────────┴───────────┐
                    │    Feature Flags      │
                    │   (Runtime Toggle)    │
                    └───────────┬───────────┘
                                │
         ┌──────────────────────┼──────────────────────┐
         ▼                      ▼                      ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ 🌐 Browser Mode │    │ ☁️ Server Mode  │    │ 🗃️ Storage     │
│ (Zero Cost)     │    │ (Premium)       │    │                │
├─────────────────┤    ├─────────────────┤    ├─────────────────┤
│ • Canvas API    │    │ • Netlify Funcs │    │ • IndexedDB     │
│ • MediaRecorder │    │ • ElevenLabs    │    │ • LocalStorage  │
│ • Web Speech    │    │ • Cloudinary    │    │ • Session Store │
│ • Client-side   │    │ • Server Jobs   │    │ • Blob URLs     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🔄 Two-Mode System Design

### 🆓 Browser Mode (Default)
**Zero-cost client-side rendering with full privacy**

```typescript
// Feature flag controls
const FLAGS = {
  USE_BROWSER_RENDERER: true,  // Enable browser mode
  ENABLE_TTS_ELEVENLABS: false // Use Web Speech API
};
```

**Components:**
- `CanvasComposer.ts` - Ken Burns effect animation engine
- `generateBrowserClip.ts` - Video composition orchestrator  
- `WebAudioUtils.ts` - Audio processing and timing
- Browser MediaRecorder API for WebM export

**Benefits:**
- ✅ No API costs or external dependencies
- ✅ Complete privacy (no data leaves browser)
- ✅ Instant processing (no queue wait times)
- ✅ Offline capability after initial load

### ☁️ Server Mode (Optional Premium)
**Enhanced quality with professional APIs**

```typescript
// Enable premium features
const FLAGS = {
  USE_BROWSER_RENDERER: false,
  ENABLE_TTS_ELEVENLABS: true
};
```

**Components:**
- Netlify Functions for serverless TTS processing
- ElevenLabs API for professional voice synthesis
- Cloudinary for enhanced video processing
- Job queue system with status polling

**Benefits:**
- ✅ Professional-grade TTS voices
- ✅ Higher resolution output formats
- ✅ Advanced video effects and transitions
- ✅ Multi-format export options

## 🎨 Frontend Architecture

### Component Hierarchy
```
App
├── NavBar
├── Create (Main Generation Page)
│   ├── UploadDropzone
│   ├── SeriesTextArea  
│   ├── ConsentCheckbox
│   ├── ProgressStepper
│   └── VideoPlayer
├── Library (Video Management)
│   ├── VideoGrid
│   └── VideoActions
└── Footer
```

### State Management
```typescript
// Generation workflow state
type GenerationState = 
  | 'idle' 
  | 'validating' 
  | 'uploading' 
  | 'queued' 
  | 'processing' 
  | 'assembling' 
  | 'ready' 
  | 'error';

// Centralized state in Create.tsx
interface GenerationData {
  jobId?: string;
  progress?: number;
  etaSeconds?: number;
  error?: string;
  videoUrl?: string;
  posterUrl?: string;
  duration?: number;
}
```

## 🎬 Video Generation Pipeline

### Browser Mode Flow
```
1. User uploads selfie image
2. Canvas loads and processes image
3. Ken Burns effect calculates keyframes
4. Audio generated via Web Speech API
5. MediaRecorder captures canvas + audio
6. WebM blob created and stored locally
7. Video player displays result
```

### Server Mode Flow  
```
1. FormData uploaded to Netlify Function
2. Job created and queued for processing
3. ElevenLabs generates professional audio
4. Server composites video with effects
5. Result uploaded to Cloudinary CDN
6. Client polls for completion status
7. Final video URL returned to player
```

## 🗄️ Data Architecture

### Local Storage Schema
```typescript
// IndexedDB video library structure
interface VideoItem {
  id: string;              // Unique identifier
  filename: string;        // Display name
  thumbnail: string;       // Poster image URL
  duration: number;        // Video length in seconds
  createdAt: Date;         // Creation timestamp
  script: string;          // Original user text
  videoUrl: string;        // Blob URL or CDN URL
}
```

### Session Storage
- Generation progress state
- User preferences and settings
- Temporary file uploads before processing

## 🔧 Configuration Management

### Environment Variables
```bash
# Core feature toggles
VITE_USE_BROWSER_RENDERER=true
VITE_ENABLE_TTS_ELEVENLABS=false
VITE_SHOW_EXPERIMENTAL_BROLL=false

# API Keys (optional)
ELEVENLABS_API_KEY=sk-...
CLOUDINARY_CLOUD_NAME=seriesme
CLOUDINARY_API_KEY=123...
```

### Runtime Feature Flags
```typescript
// lib/flags.ts - Dynamic feature toggling
export const FLAGS = {
  USE_BROWSER_RENDERER: import.meta.env.VITE_USE_BROWSER_RENDERER !== 'false',
  ENABLE_TTS_ELEVENLABS: import.meta.env.VITE_ENABLE_TTS_ELEVENLABS === 'true',
  SHOW_EXPERIMENTAL_BROLL: import.meta.env.VITE_SHOW_EXPERIMENTAL_BROLL === 'true',
} as const;
```

## 🔐 Security & Privacy

### Browser Mode Security
- All processing happens client-side
- No data transmission to external servers  
- Local blob URLs for video storage
- User consent required before any processing

### Server Mode Security
- API key validation in Netlify Functions
- CORS protection on all endpoints
- Rate limiting on generation requests
- Automatic cleanup of temporary files

## 📱 Mobile & Accessibility

### Responsive Design
- Mobile-first component design
- Touch-friendly interface elements
- Optimized video playback controls
- Adaptive canvas sizing for device screens

### Accessibility Features
- ARIA live regions for screen reader updates
- Keyboard navigation throughout interface
- Focus management during state transitions
- High contrast mode compatibility
- Reduced motion preference support

## 🚀 Performance Optimization

### Loading Performance
- Code splitting by route and feature
- Lazy loading of heavy video processing libs
- Image optimization and lazy loading
- Service worker caching (future enhancement)

### Runtime Performance  
- Canvas rendering optimization
- Memory management for large video files
- Progressive video loading
- Background processing where possible

---
*Architecture Version: 2.0 | Last Updated: 2024-01-01*