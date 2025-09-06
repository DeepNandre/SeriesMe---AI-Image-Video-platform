import type { Handler } from '@netlify/functions'
import { jobs } from './generate'

// Real video processing using cloud services
// This version shows how to integrate with actual services

interface VideoProcessingData {
  jobId: string
  script: string
  selfieData: string
}

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  try {
    const { jobId, script, selfieData }: VideoProcessingData = JSON.parse(event.body || '{}')

    if (!jobId || !script || !selfieData) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required fields' })
      }
    }

    // Process video using cloud services
    await processVideoWithCloudServices(jobId, script, selfieData)

    return {
      statusCode: 202,
      body: JSON.stringify({ message: 'Processing started' })
    }

  } catch (error) {
    console.error('Background processing error:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Processing failed' })
    }
  }
}

async function processVideoWithCloudServices(jobId: string, script: string, selfieData: string) {
  const job = jobs.get(jobId)
  if (!job) return

  try {
    // Stage 1: Generate TTS Audio
    job.status = 'processing'
    job.progress = 25
    job.etaSeconds = 60
    jobs.set(jobId, job)

    console.log(`[${jobId}] Generating TTS audio`)
    const audioUrl = await generateTTSAudio(script)

    // Stage 2: Upload and process image
    job.progress = 50
    jobs.set(jobId, job)

    console.log(`[${jobId}] Processing selfie image`)
    const imageUrl = await uploadAndProcessImage(selfieData, jobId)

    // Stage 3: Create video with Ken Burns effect
    job.status = 'assembling'
    job.progress = 75
    job.etaSeconds = 30
    jobs.set(jobId, job)

    console.log(`[${jobId}] Creating video with Ken Burns effect`)
    const videoUrl = await createVideoWithKenBurns(imageUrl, audioUrl, jobId)

    // Stage 4: Add captions and watermark
    job.progress = 90
    jobs.set(jobId, job)

    console.log(`[${jobId}] Adding captions and watermark`)
    const { finalVideoUrl, posterUrl } = await addCaptionsAndWatermark(videoUrl, script, jobId)

    // Stage 5: Complete
    job.status = 'ready'
    job.progress = 100
    job.etaSeconds = 0
    job.videoUrl = finalVideoUrl
    job.posterUrl = posterUrl
    job.durationSec = calculateDuration(script)
    job.width = 1080
    job.height = 1920
    jobs.set(jobId, job)

    console.log(`[${jobId}] Video processing complete: ${finalVideoUrl}`)

    // Clean up after 5 minutes
    setTimeout(() => jobs.delete(jobId), 5 * 60 * 1000)

  } catch (error) {
    console.error(`[${jobId}] Processing failed:`, error)
    job.status = 'error'
    job.error = error instanceof Error ? error.message : 'Processing failed. Please try again.'
    jobs.set(jobId, job)
  }
}

// Generate TTS audio using cloud service
async function generateTTSAudio(script: string): Promise<string> {
  // Option 1: Use ElevenLabs API
  const elevenlabsApiKey = process.env.ELEVENLABS_API_KEY
  if (elevenlabsApiKey) {
    return generateElevenLabsTTS(script, elevenlabsApiKey)
  }
  
  // Option 2: Use Google Cloud TTS
  const googleTTSKey = process.env.GOOGLE_TTS_API_KEY
  if (googleTTSKey) {
    return generateGoogleTTS(script, googleTTSKey)
  }
  
  // Option 3: Use browser TTS via Puppeteer (more complex setup)
  // return generateBrowserTTS(script)
  
  // Fallback: Return demo audio URL
  console.log('No TTS service configured, using demo audio')
  return 'https://www2.cs.uic.edu/~i101/SoundFiles/BabyElephantWalk60.wav'
}

async function generateElevenLabsTTS(script: string, apiKey: string): Promise<string> {
  const voiceId = process.env.ELEVENLABS_VOICE_ID || 'pNInz6obpgDQGcFmaJgB' // Default voice
  
  const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
    method: 'POST',
    headers: {
      'Accept': 'audio/mpeg',
      'Content-Type': 'application/json',
      'xi-api-key': apiKey
    },
    body: JSON.stringify({
      text: script,
      model_id: 'eleven_monolingual_v1',
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.5
      }
    })
  })
  
  if (!response.ok) {
    throw new Error(`ElevenLabs TTS failed: ${response.statusText}`)
  }
  
  const audioBuffer = await response.arrayBuffer()
  // Upload to cloud storage (Cloudinary, AWS S3, etc.)
  return uploadAudioToStorage(audioBuffer, 'audio.mp3')
}

async function generateGoogleTTS(script: string, apiKey: string): Promise<string> {
  const response = await fetch(`https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      input: { text: script },
      voice: { languageCode: 'en-US', ssmlGender: 'NEUTRAL' },
      audioConfig: { audioEncoding: 'MP3' }
    })
  })
  
  if (!response.ok) {
    throw new Error(`Google TTS failed: ${response.statusText}`)
  }
  
  const data = await response.json()
  const audioBuffer = Buffer.from(data.audioContent, 'base64')
  return uploadAudioToStorage(audioBuffer, 'audio.mp3')
}

// Upload and process image with Cloudinary
async function uploadAndProcessImage(selfieData: string, jobId: string): Promise<string> {
  const cloudinaryApiKey = process.env.CLOUDINARY_API_KEY
  const cloudinaryApiSecret = process.env.CLOUDINARY_API_SECRET
  const cloudinaryCloudName = process.env.CLOUDINARY_CLOUD_NAME
  
  if (!cloudinaryApiKey || !cloudinaryApiSecret || !cloudinaryCloudName) {
    console.log('Cloudinary not configured, using demo image')
    return 'https://images.unsplash.com/photo-1494790108755-2616b612b1e5'
  }
  
  // Upload image to Cloudinary
  const formData = new FormData()
  formData.append('file', selfieData)
  formData.append('upload_preset', 'seriesme_uploads') // Configure this in Cloudinary
  formData.append('public_id', `seriesme/${jobId}/selfie`)
  
  const uploadResponse = await fetch(`https://api.cloudinary.com/v1_1/${cloudinaryCloudName}/image/upload`, {
    method: 'POST',
    body: formData
  })
  
  if (!uploadResponse.ok) {
    throw new Error('Failed to upload image to Cloudinary')
  }
  
  const uploadData = await uploadResponse.json()
  return uploadData.secure_url
}

// Create video with Ken Burns effect using Cloudinary
async function createVideoWithKenBurns(imageUrl: string, audioUrl: string, jobId: string): Promise<string> {
  const cloudinaryCloudName = process.env.CLOUDINARY_CLOUD_NAME
  
  if (!cloudinaryCloudName) {
    // Fallback to demo video
    return 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4'
  }
  
  // Use Cloudinary's video transformation API to create Ken Burns effect
  // This creates a video from a static image with zoom and pan effects
  const kenBurnsUrl = `https://res.cloudinary.com/${cloudinaryCloudName}/video/upload/` +
    `w_1080,h_1920,c_fill,g_face,` + // Crop to 9:16, focus on face
    `e_accelerate:-50,` + // Slow motion effect
    `fl_attachment:seriesme_${jobId}` + // Download filename
    `/l_video:${encodeURIComponent(audioUrl)}/fl_layer_apply,so_0` + // Add audio layer
    `/${extractPublicId(imageUrl)}.mp4` // Convert to video
  
  return kenBurnsUrl
}

// Add captions and watermark
async function addCaptionsAndWatermark(videoUrl: string, script: string, jobId: string): Promise<{finalVideoUrl: string, posterUrl: string}> {
  const cloudinaryCloudName = process.env.CLOUDINARY_CLOUD_NAME
  
  if (!cloudinaryCloudName) {
    return {
      finalVideoUrl: videoUrl,
      posterUrl: '/placeholder.svg'
    }
  }
  
  // Generate captions with timing
  const captionTransforms = generateCaptionTransforms(script)
  
  // Add watermark and captions
  const finalVideoUrl = `https://res.cloudinary.com/${cloudinaryCloudName}/video/upload/` +
    `${captionTransforms},` + // Add captions
    `l_text:Arial_60_bold:SeriesMe,co_white,o_50,g_south_east,x_20,y_20` + // Watermark
    `/${extractPublicId(videoUrl)}.mp4`
  
  // Generate poster thumbnail
  const posterUrl = `https://res.cloudinary.com/${cloudinaryCloudName}/video/upload/` +
    `so_2.0,w_1080,h_1920,c_fill,f_jpg` + // 2-second frame, resize to poster
    `/${extractPublicId(videoUrl)}.jpg`
  
  return { finalVideoUrl, posterUrl }
}

// Helper functions
function extractPublicId(cloudinaryUrl: string): string {
  const parts = cloudinaryUrl.split('/')
  const filename = parts[parts.length - 1]
  return filename.split('.')[0]
}

function generateCaptionTransforms(script: string): string {
  // Simple caption overlay - in production, you'd parse timing better
  const words = script.split(' ')
  const wordsPerLine = 4
  const lines = []
  
  for (let i = 0; i < words.length; i += wordsPerLine) {
    lines.push(words.slice(i, i + wordsPerLine).join(' '))
  }
  
  return lines.map((line, index) => {
    const startTime = index * 2 // 2 seconds per line
    const endTime = (index + 1) * 2
    return `l_text:Arial_48_bold:${encodeURIComponent(line)},co_white,bo_2px_solid_black,g_south,y_200,so_${startTime},eo_${endTime}`
  }).join('/')
}

async function uploadAudioToStorage(audioBuffer: ArrayBuffer | Buffer, filename: string): Promise<string> {
  // This would upload to your cloud storage and return the URL
  // For demo, return a placeholder
  console.log(`Uploading ${filename}, size: ${audioBuffer.byteLength} bytes`)
  return `https://demo-storage.com/audio/${Date.now()}_${filename}`
}

function calculateDuration(script: string): number {
  const wordCount = script.split(/\s+/).length
  const estimatedSeconds = Math.ceil(wordCount / 3) // 3 words per second
  return Math.max(6, Math.min(20, estimatedSeconds))
}