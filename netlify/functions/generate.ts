import type { Handler } from '@netlify/functions'

// Simple in-memory job storage (for demo purposes)
// In production, you'd use Netlify Blobs or external database
const jobs = new Map<string, JobData>()

interface JobData {
  status: 'queued' | 'processing' | 'assembling' | 'ready' | 'error'
  progress: number
  etaSeconds: number
  error?: string
  videoUrl?: string
  posterUrl?: string
  durationSec?: number
  width?: number
  height?: number
  createdAt: number
  script: string
  selfieData?: string
}

function parseMultipartData(body: string, boundary: string) {
  const parts: Record<string, string> = {}
  const boundaryStr = `--${boundary}`
  const sections = body.split(boundaryStr).slice(1, -1)
  
  for (const section of sections) {
    const [headerPart, ...contentParts] = section.split('\r\n\r\n')
    const content = contentParts.join('\r\n\r\n').replace(/\r\n$/, '')
    
    const nameMatch = headerPart.match(/name="([^"]+)"/)
    if (nameMatch) {
      parts[nameMatch[1]] = content
    }
  }
  
  return parts
}

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  try {
    // Parse multipart form data
    const contentType = event.headers['content-type'] || ''
    const boundaryMatch = contentType.match(/boundary=([^;]+)/)
    
    if (!contentType.includes('multipart/form-data') || !boundaryMatch) {
      return {
        statusCode: 400,
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ error: 'Content-Type must be multipart/form-data' })
      }
    }

    const boundary = boundaryMatch[1]
    const body = event.body || ''
    const formData = parseMultipartData(body, boundary)

    const script = formData.script?.trim() || ''
    const consent = formData.consent?.trim() || ''
    const selfieData = formData.selfie || ''

    // Validate inputs
    if (!script || script.length > 200) {
      return {
        statusCode: 400,
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ error: 'Invalid script length (max 200 characters)' })
      }
    }

    if (consent !== 'true') {
      return {
        statusCode: 400,
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ error: 'Consent required' })
      }
    }

    if (!selfieData) {
      return {
        statusCode: 400,
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ error: 'Selfie image required' })
      }
    }

    // Generate job ID
    const jobId = `job_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`

    // Store job data
    const jobData: JobData = {
      status: 'queued',
      progress: 0,
      etaSeconds: 90, // Reduced for serverless processing
      createdAt: Date.now(),
      script,
      selfieData
    }

    jobs.set(jobId, jobData)

    // Trigger background processing function
    try {
      const backgroundProcessingUrl = `${process.env.URL}/.netlify/functions/process-video-background`
      
      // Trigger background function (fire and forget)
      fetch(backgroundProcessingUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobId,
          script,
          selfieData
        })
      }).catch(console.error) // Don't wait for response
      
    } catch (error) {
      console.error('Failed to trigger background processing:', error)
      // Fallback to inline processing
      setTimeout(() => processJob(jobId), 100)
    }

    return {
      statusCode: 202,
      headers: {
        'content-type': 'application/json',
        'access-control-allow-origin': '*',
        'access-control-allow-headers': 'Content-Type',
        'access-control-allow-methods': 'POST',
      },
      body: JSON.stringify({ jobId })
    }

  } catch (error) {
    console.error('Generation error:', error)
    return {
      statusCode: 500,
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ error: 'Internal server error' })
    }
  }
}

// Simulate video processing pipeline
async function processJob(jobId: string) {
  const job = jobs.get(jobId)
  if (!job) return

  try {
    // Stage 1: Processing
    job.status = 'processing'
    job.progress = 25
    job.etaSeconds = 60
    jobs.set(jobId, job)

    // Simulate TTS processing delay
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Stage 2: Assembling
    job.status = 'assembling'
    job.progress = 75
    job.etaSeconds = 20
    jobs.set(jobId, job)

    // Simulate video assembly delay
    await new Promise(resolve => setTimeout(resolve, 3000))

    // Stage 3: Ready
    job.status = 'ready'
    job.progress = 100
    job.etaSeconds = 0
    // For demo, use placeholder video
    job.videoUrl = 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4'
    job.posterUrl = '/placeholder.svg'
    job.durationSec = 12
    job.width = 1080
    job.height = 1920
    jobs.set(jobId, job)

    // Clean up job after 5 minutes
    setTimeout(() => jobs.delete(jobId), 5 * 60 * 1000)

  } catch (error) {
    job.status = 'error'
    job.error = 'Processing failed. Please try again.'
    jobs.set(jobId, job)
  }
}

// Export jobs for use by other functions
export { jobs }


