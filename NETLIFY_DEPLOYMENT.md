# SeriesMe Netlify-Only Deployment Guide

🚀 **Complete serverless deployment using only Netlify!** No separate backend required.

## Overview

SeriesMe now runs entirely on Netlify using:
- **Frontend**: React app deployed to Netlify
- **API**: Netlify Functions for all backend processing
- **Video Processing**: Serverless video generation pipeline
- **Storage**: Cloud services (Cloudinary, AWS S3) for media storage
- **Job Management**: In-memory state with optional Netlify Blobs

## Quick Deploy

### 1. Connect to Netlify

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy)

Or manually:
1. Push this repo to GitHub
2. Connect to Netlify
3. Set build settings (already configured in `netlify.toml`)

### 2. Configure Environment Variables

In Netlify Dashboard → Site Settings → Environment Variables:

#### Required (Basic Setup)
```bash
# No variables required for basic demo functionality!
```

#### Optional (Production Features)
```bash
# TTS Services (choose one)
ELEVENLABS_API_KEY=your_elevenlabs_api_key
ELEVENLABS_VOICE_ID=your_voice_id

# OR
GOOGLE_TTS_API_KEY=your_google_cloud_api_key

# Cloud Storage & Video Processing 
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret

# OR AWS S3
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
AWS_S3_BUCKET=your_bucket_name

# Advanced Features
NETLIFY_BLOBS_API_KEY=your_netlify_blobs_key  # For persistent job storage
```

### 3. Deploy & Test

1. Deploy will automatically build and deploy
2. Visit your Netlify site URL
3. Upload a selfie and test video generation!

## How It Works

### Architecture

```
Frontend (React) 
    ↓ /api/generate
Netlify Function: generate.ts
    ↓ triggers
Background Function: process-video-background.ts
    ↓ uses
Cloud Services (TTS + Video Processing)
    ↓ stores
Cloud Storage (videos, audio, images)
```

### Video Processing Pipeline

1. **Upload & Validate** (`generate.ts`)
   - Receive selfie + script
   - Validate inputs
   - Create job ID
   - Trigger background processing

2. **TTS Generation** (`process-video-background.ts`)
   - Convert script to speech
   - Use ElevenLabs, Google TTS, or fallback

3. **Image Processing**
   - Upload selfie to cloud storage
   - Prepare for video creation

4. **Video Creation**
   - Apply Ken Burns effect to image
   - Sync with generated audio
   - Create vertical (9:16) video

5. **Post-Processing**
   - Add captions with timing
   - Apply SeriesMe watermark
   - Generate thumbnail poster

6. **Completion**
   - Return URLs to frontend
   - Clean up temporary data

### Job State Management

**Development**: In-memory storage (jobs lost on function restart)
**Production**: Optional Netlify Blobs for persistent storage

## Configuration Options

### Level 1: Demo Mode (No Setup Required)
- Uses placeholder videos
- Basic job state management
- Perfect for testing the interface

### Level 2: Basic TTS
Add TTS service for real audio:
```bash
ELEVENLABS_API_KEY=your_key
ELEVENLABS_VOICE_ID=your_voice
```

### Level 3: Full Video Processing
Add Cloudinary for complete pipeline:
```bash
CLOUDINARY_CLOUD_NAME=your_name
CLOUDINARY_API_KEY=your_key  
CLOUDINARY_API_SECRET=your_secret
```

### Level 4: Production Scale
Add persistent storage:
```bash
NETLIFY_BLOBS_API_KEY=your_key
```

## Cloud Service Setup

### ElevenLabs TTS (Recommended)

1. Sign up at [ElevenLabs](https://elevenlabs.io)
2. Get API key from dashboard
3. Choose a voice ID (or use default)
4. Add to Netlify environment variables

**Pricing**: ~$0.30 per 1,000 characters

### Cloudinary Video Processing

1. Sign up at [Cloudinary](https://cloudinary.com)
2. Get account details from dashboard
3. Create upload preset named `seriesme_uploads`
4. Enable unsigned uploads
5. Add credentials to Netlify environment

**Pricing**: Generous free tier, then pay-as-you-go

### Google Cloud TTS (Alternative)

1. Enable Text-to-Speech API in Google Cloud Console
2. Create API key
3. Add to Netlify environment
4. Configure voice settings in code

## Netlify Functions Details

### `generate.ts`
- **Timeout**: 10 seconds (standard function)
- **Purpose**: Receive upload, validate, start processing
- **Returns**: Job ID immediately (202 response)

### `process-video-background.ts`
- **Timeout**: 15 minutes (background function)
- **Purpose**: Complete video processing pipeline
- **Async**: Runs independently after generate returns

### `status.ts` & `result.ts`
- **Timeout**: 10 seconds
- **Purpose**: Check job progress and fetch results
- **Polling**: Frontend polls every 2 seconds

## Limitations & Solutions

### Netlify Function Limits

| Limit | Value | Solution |
|-------|-------|----------|
| Execution Time | 10s (15m background) | Use background functions |
| Payload Size | 6MB | Upload to cloud storage first |
| Memory | 1GB | Process in chunks |
| Concurrent | 1000/min | Queue system if needed |

### Video Processing Constraints

- **File Size**: 10MB max for direct upload
- **Processing Time**: ~1-3 minutes per video
- **Format**: Focus on 9:16 vertical videos
- **Length**: 6-20 seconds optimal

## Monitoring & Debugging

### Netlify Function Logs
1. Netlify Dashboard → Functions tab
2. Click function name → View logs
3. Real-time error monitoring

### Common Issues

**"Function timeout"**
- Ensure using background functions for long processing
- Check cloud service response times

**"Job not found"**
- Using in-memory storage - jobs lost on restart
- Consider Netlify Blobs for persistence

**"TTS failed"**
- Check API keys and quotas
- Fallback to demo audio if configured

### Performance Optimization

1. **Parallel Processing**: Use Promise.all for concurrent cloud calls
2. **Caching**: Cache processed assets in cloud storage
3. **Pre-warming**: Keep functions warm with scheduled pings
4. **CDN**: Use cloud storage CDN for fast video delivery

## Cost Estimation

### Free Tier (Demo Mode)
- **Netlify**: Free tier covers most usage
- **No external services**: $0/month
- **Limitations**: Demo videos only

### Basic Production
- **Netlify Pro**: $19/month (for background functions)
- **ElevenLabs**: ~$22/month (30k characters)
- **Cloudinary**: ~$89/month (25 credits)
- **Total**: ~$130/month for moderate usage

### Scale Considerations

- **1,000 videos/month**: ~$130/month
- **10,000 videos/month**: ~$500/month
- **100,000 videos/month**: Consider dedicated infrastructure

## Security & Best Practices

### Environment Variables
- Never commit API keys
- Use Netlify's secure environment variable storage
- Rotate keys regularly

### Content Safety
- Validate file types and sizes
- Implement rate limiting if needed
- Monitor for abuse patterns

### Data Privacy
- Jobs automatically cleaned up after completion
- No permanent storage of user uploads
- GDPR compliant with proper setup

## Troubleshooting

### Build Errors
```bash
# Clear cache and rebuild
netlify build --clear-cache

# Check function dependencies
cd netlify/functions
npm install
```

### Runtime Errors
```bash
# Check function logs
netlify functions:invoke generate --payload='{"test": true}'

# Local development
netlify dev
```

### Video Processing Issues
1. Verify cloud service credentials
2. Check file format compatibility
3. Monitor processing timeouts
4. Test with smaller files first

## Next Steps

After successful deployment:

1. **Custom Domain**: Add your domain in Netlify Dashboard
2. **Analytics**: Set up monitoring and usage tracking
3. **A/B Testing**: Experiment with different video styles
4. **User Accounts**: Add authentication if needed
5. **Payment Integration**: Monetize with Stripe integration

## Support

- **Documentation**: Check function logs for detailed errors
- **Community**: Netlify Discord for function questions
- **Issues**: GitHub issues for SeriesMe-specific problems

Your SeriesMe platform is now fully serverless and ready to scale! 🎬✨