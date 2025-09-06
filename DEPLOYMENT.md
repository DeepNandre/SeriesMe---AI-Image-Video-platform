# SeriesMe Production Deployment Guide

## Overview

SeriesMe can be deployed in multiple configurations:
1. **Netlify + Separate Backend** (Recommended)
2. **Full Netlify Serverless** (Future)
3. **Traditional Hosting**

## Option 1: Netlify Frontend + Backend Service (Recommended)

### Frontend Deployment (Netlify)

1. **Connect Repository to Netlify**
   - Build command: `cd face-a-phrase && npm i && npm run build`
   - Publish directory: `face-a-phrase/dist`
   - Functions directory: `netlify/functions`

2. **Environment Variables** (Netlify Dashboard)
   ```
   BACKEND_API_URL=https://your-backend-url.com
   ```

### Backend Deployment Options

#### Option A: Railway/Render/Fly.io

1. **Setup Backend Service**
   ```bash
   # Deploy backend to your preferred service
   # Set environment variables:
   PORT=8001
   ALLOWED_ORIGINS=https://your-netlify-app.netlify.app
   FFMPEG_BIN=ffmpeg
   TALKING_HEAD_MODE=kenburns
   ```

2. **Required System Dependencies**
   - FFmpeg
   - Python 3.9+

#### Option B: Docker Deployment

1. **Use provided Docker setup**
   ```bash
   cd backend
   docker compose up --build
   ```

2. **Environment Configuration**
   ```bash
   cp .env.example .env
   # Edit .env with your settings
   ```

## Option 2: Local Development Setup

### Backend Setup
```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your settings
uvicorn app.main:app --reload --port 8001
```

### Frontend Setup
```bash
cd face-a-phrase
cp .env.example .env.local
# Edit .env.local:
echo 'VITE_API_BASE_URL=http://localhost:8001' > .env.local
npm install
npm run dev
```

### Full Stack Local (Netlify Dev)
```bash
cp .env.example .env
# Edit .env with backend URL
netlify dev
```

## Assets Configuration

### Required Assets (Backend)
Create these files in `backend/assets/`:

1. **watermark.png** (optional)
   - Semi-transparent logo overlay
   - Recommended: 200x60px PNG with transparency

2. **endslate.png** (optional)
   - End screen for videos
   - Recommended: 1080x1920px

### Fonts (Auto-handled)
The system uses system fonts for captions. No additional fonts required.

## Environment Variables Reference

### Frontend (.env.local)
```bash
VITE_API_BASE_URL=https://your-backend-url.com
```

### Backend (.env)
```bash
PORT=8001
ALLOWED_ORIGINS=https://your-netlify-app.netlify.app,https://your-domain.com
FFMPEG_BIN=ffmpeg
TALKING_HEAD_MODE=kenburns

# Optional: Premium TTS
ELEVENLABS_API_KEY=your_key
ELEVENLABS_VOICE_ID=your_voice

# Optional: Advanced talking head
SADTALKER_BIN=python scripts/sadtalker_infer.py
```

### Netlify Functions (.env or Netlify UI)
```bash
BACKEND_API_URL=https://your-backend-url.com
```

## Production Checklist

### Backend
- [ ] FFmpeg installed and accessible
- [ ] Python dependencies installed
- [ ] Environment variables configured
- [ ] Assets directory created (watermark optional)
- [ ] CORS origins include your frontend domain
- [ ] SSL/HTTPS enabled
- [ ] Persistent storage for uploads/outputs

### Frontend  
- [ ] Built and deployed to Netlify
- [ ] API base URL configured
- [ ] Netlify functions pointing to backend
- [ ] Custom domain configured (optional)

### Monitoring
- [ ] Backend health check endpoint works
- [ ] Video generation pipeline tested
- [ ] Error handling verified
- [ ] Performance monitoring setup

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Add your frontend domain to `ALLOWED_ORIGINS` in backend

2. **FFmpeg Not Found**
   - Install FFmpeg on backend server
   - Set correct `FFMPEG_BIN` path

3. **502 Backend Unavailable**  
   - Verify backend is running and accessible
   - Check `BACKEND_API_URL` in Netlify environment

4. **File Upload Issues**
   - Check file size limits (10MB default)
   - Verify upload directory permissions

### Testing Deployment

1. **Test Video Generation**
   ```bash
   curl -X POST https://your-backend/api/generate \
     -F "selfie=@test.jpg" \
     -F "script=Hello world" \
     -F "consent=true"
   ```

2. **Test Status Endpoint**
   ```bash
   curl "https://your-backend/api/status?jobId=YOUR_JOB_ID"
   ```

3. **Frontend Integration**
   - Upload a test image
   - Verify progress tracking works
   - Check final video download

## Performance Optimization

1. **Backend Scaling**
   - Consider job queue for high load
   - Implement background worker processes
   - Use faster TTS services (ElevenLabs)

2. **Frontend Optimization**
   - Enable CDN for static assets
   - Implement video streaming for large files
   - Add service worker for offline support

## Security Considerations

1. **Input Validation**
   - File type and size limits enforced
   - Script length validation
   - Consent verification required

2. **Rate Limiting** (Implement if needed)
   - Add request rate limiting
   - IP-based throttling
   - User session limits

3. **Content Policy**
   - Watermark enforcement
   - Content moderation hooks
   - Usage analytics