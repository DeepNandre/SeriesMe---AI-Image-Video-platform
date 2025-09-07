// Production API client for SeriesMe backend
import { z } from 'zod';
import { FLAGS } from './flags';
import { generateBrowserClip, BrowserClipResult } from './render/generateBrowserClip';
import { modelRouter } from './ai/ModelRouter';

// For Netlify-only deployment, use relative paths to hit Netlify Functions
// Set VITE_API_BASE_URL only if using external backend
const API_BASE = (import.meta.env.VITE_API_BASE_URL as string | undefined) || '';

export interface GenerateResponse { jobId: string }

export type Status = 'queued' | 'processing' | 'assembling' | 'ready' | 'error'
export interface StatusResponse {
  status: Status;
  progress?: number;
  etaSeconds?: number;
  error?: string;
}

export interface ResultResponse {
  videoUrl: string;
  posterUrl: string;
  durationSec: number;
  width: number;
  height: number;
}

// Zod schemas for runtime validation
export const GenerateResponseSchema = z.object({ jobId: z.string().min(1) });
export const StatusSchema = z.object({
  status: z.enum(['queued','processing','assembling','ready','error']),
  progress: z.number().int().min(0).max(100).optional(),
  etaSeconds: z.number().int().min(0).optional(),
  error: z.string().optional(),
});
export const ResultSchema = z.object({
  videoUrl: z.string(),
  posterUrl: z.string(),
  durationSec: z.number().int().positive(),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
});

// API Error handling
class APIError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'APIError';
  }
}

async function handleResponse<T>(response: Response, schema: z.ZodSchema<T>): Promise<T> {
  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Unknown error');
    throw new APIError(`API Error: ${errorText}`, response.status);
  }
  
  try {
    const data = await response.json();
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new APIError('Invalid response format from server');
    }
    throw new APIError('Failed to parse server response');
  }
}

// Client-side input validation
function validateGenerateInput(formData: FormData): void {
  const selfie = formData.get('selfie') as File;
  const script = formData.get('script') as string;
  const consent = formData.get('consent') as string;

  if (!selfie || !script || consent !== 'true') {
    throw new APIError('Missing required fields');
  }

  if (!['image/jpeg', 'image/png'].includes(selfie.type)) {
    throw new APIError('Please choose a JPG/PNG under 10 MB.');
  }

  if (selfie.size > 10 * 1024 * 1024) {
    throw new APIError('Please choose a JPG/PNG under 10 MB.');
  }

  if (script.length > 200) {
    throw new APIError('Keep it under 200 characters.');
  }
}

// Production API functions
// AI Talking-Head Generation Function
async function generateAITalkingHead(selfieFile: File, script: string): Promise<BrowserClipResult> {
  console.log('🤖 Starting AI talking-head generation pipeline...');
  
  try {
    // Step 1: Generate TTS audio from script
    console.log('🎤 Generating voice audio with AI...');
    const audioBlob = await modelRouter.generateTTS(script, {
      voice: 'default',
      speed: 1.0,
      pitch: 1.0
    });
    console.log('✅ TTS audio generated:', audioBlob.size, 'bytes');

    // Step 2: Convert image file to blob for AI processing
    const imageBlob = new Blob([await selfieFile.arrayBuffer()], { type: selfieFile.type });
    
    // Step 3: Generate face animation with lip sync
    console.log('🎭 Generating face animation with lip sync...');
    const videoBlob = await modelRouter.generateFaceAnimation(imageBlob, audioBlob, {
      resolution: { width: 1080, height: 1920 },
      fps: 30
    });
    console.log('✅ Face animation generated:', videoBlob.size, 'bytes');

    // Step 4: Generate poster/thumbnail
    console.log('🖼️ Generating video thumbnail...');
    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1920;
    const ctx = canvas.getContext('2d')!;
    
    // Load and draw the selfie as poster
    const img = new Image();
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      img.src = URL.createObjectURL(imageBlob);
    });
    
    const scale = Math.min(canvas.width / img.width, canvas.height / img.height);
    const x = (canvas.width - img.width * scale) / 2;
    const y = (canvas.height - img.height * scale) / 2;
    ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
    
    const posterBlob = await new Promise<Blob>((resolve) => {
      canvas.toBlob(resolve!, 'image/jpeg', 0.8);
    });
    
    // Get audio duration for metadata
    const audioContext = new AudioContext();
    const audioBuffer = await audioContext.decodeAudioData(await audioBlob.arrayBuffer());
    const duration = audioBuffer.duration;
    
    console.log('🎉 AI talking-head generation complete!');
    
    return {
      videoBlob,
      posterBlob: posterBlob!,
      duration,
      width: 1080,
      height: 1920,
      format: 'webm'
    };
    
  } catch (error) {
    console.error('❌ AI generation failed, falling back to Canvas mode:', error);
    
    // Fallback to current Canvas-based generation
    return await generateBrowserClip(selfieFile, script);
  }
}

// Browser rendering storage for simulated jobs
const browserJobs = new Map<string, {
  status: Status;
  progress: number;
  etaSeconds: number;
  createdAt: number;
  result?: BrowserClipResult;
  error?: string;
}>();

export async function generateClip(formData: FormData): Promise<GenerateResponse> {
  // Client-side validation
  validateGenerateInput(formData);
  
  if (FLAGS.USE_BROWSER_RENDERER) {
    // Browser-based rendering
    const jobId = `browser_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    
    // Store initial job
    browserJobs.set(jobId, {
      status: 'queued',
      progress: 0,
      etaSeconds: 15,
      createdAt: Date.now()
    });
    
    // Start background processing
    processBrowserJob(jobId, formData);
    
    return { jobId };
  }
  
  // Server-side rendering
  const url = `${API_BASE}/api/generate`;
  const response = await fetch(url, {
    method: 'POST',
    body: formData,
  });
  
  return handleResponse(response, GenerateResponseSchema);
}

async function processBrowserJob(jobId: string, formData: FormData): Promise<void> {
  const job = browserJobs.get(jobId);
  if (!job) return;

  try {
    const selfieFile = formData.get('selfie') as File;
    const script = formData.get('script') as string;
    
    console.log('🎬 Starting browser video generation...', { jobId, script });
    
    // Stage 1: Processing
    job.status = 'processing';
    job.progress = 25;
    job.etaSeconds = 10;
    browserJobs.set(jobId, job);

    // Simulate some processing time
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Stage 2: Assembling  
    job.status = 'assembling';
    job.progress = 75;
    job.etaSeconds = 5;
    browserJobs.set(jobId, job);

    let result: BrowserClipResult;
    
    if (FLAGS.USE_AI_GENERATION) {
      console.log('🎨 Generating AI talking-head video...');
      // Generate the actual AI video
      result = await generateAITalkingHead(selfieFile, script);
    } else {
      console.log('🎨 Generating browser video with Canvas API...');
      // Generate the canvas-based video (current implementation)  
      result = await generateBrowserClip(selfieFile, script);
    }
    
    console.log('✅ Browser video generation complete!', { 
      duration: result.duration, 
      format: result.format,
      size: result.videoBlob.size 
    });

    // Complete - Update the job object atomically
    const updatedJob = browserJobs.get(jobId);
    if (updatedJob) {
      const finalJob = {
        ...updatedJob,
        status: 'ready' as Status,
        progress: 100,
        etaSeconds: 0,
        result: result
      };
      browserJobs.set(jobId, finalJob);
      
      console.log('🎉 Job marked as ready in browserJobs:', jobId);
      console.log('🔍 Final job state:', { 
        status: finalJob.status, 
        progress: finalJob.progress, 
        hasResult: !!finalJob.result 
      });
      
      // Verify the update took effect
      const verification = browserJobs.get(jobId);
      console.log('✅ Job state verification:', { 
        jobId,
        status: verification?.status, 
        hasResult: !!verification?.result 
      });
    }

    // Auto-cleanup after 5 minutes
    setTimeout(() => {
      const cleanupJob = browserJobs.get(jobId);
      if (cleanupJob?.result) {
        URL.revokeObjectURL(cleanupJob.result.videoBlob as unknown as string);
        URL.revokeObjectURL(cleanupJob.result.posterBlob as unknown as string);
      }
      browserJobs.delete(jobId);
    }, 5 * 60 * 1000);

  } catch (error) {
    console.error('❌ Browser video generation failed:', error);
    const errorJob = browserJobs.get(jobId);
    if (errorJob) {
      const failedJob = {
        ...errorJob,
        status: 'error' as Status,
        error: error instanceof Error ? error.message : 'Video generation failed'
      };
      browserJobs.set(jobId, failedJob);
      console.log('❌ Job marked as failed:', { jobId, error: failedJob.error });
    }
  }
}

export async function pollStatus(jobId: string): Promise<StatusResponse> {
  if (!jobId) {
    throw new APIError('Job ID is required');
  }
  
  // Browser job
  if (jobId.startsWith('browser_')) {
    const job = browserJobs.get(jobId);
    if (!job) {
      console.error('❌ Job not found in browserJobs:', jobId);
      console.log('📋 Available jobs:', Array.from(browserJobs.keys()));
      throw new APIError('Job not found');
    }
    
    console.log('🔍 Polling browser job:', { 
      jobId, 
      status: job.status, 
      progress: job.progress, 
      etaSeconds: job.etaSeconds,
      hasResult: !!job.result,
      createdAt: new Date(job.createdAt).toISOString(),
      ageSeconds: Math.floor((Date.now() - job.createdAt) / 1000)
    });
    
    return {
      status: job.status,
      progress: job.progress,
      etaSeconds: job.etaSeconds,
      ...(job.error && { error: job.error })
    };
  }
  
  // Server job
  const url = `${API_BASE}/api/status?jobId=${encodeURIComponent(jobId)}`;
  const response = await fetch(url);
  
  return handleResponse(response, StatusSchema);
}

export async function getFinalResult(jobId: string): Promise<ResultResponse> {
  if (!jobId) {
    throw new APIError('Job ID is required');
  }
  
  // Browser job
  if (jobId.startsWith('browser_')) {
    const job = browserJobs.get(jobId);
    if (!job) {
      throw new APIError('Job not found');
    }
    
    if (job.status !== 'ready' || !job.result) {
      throw new APIError('Video not ready yet');
    }
    
    // Create object URLs for the blobs
    const videoUrl = URL.createObjectURL(job.result.videoBlob);
    const posterUrl = URL.createObjectURL(job.result.posterBlob);
    
    return {
      videoUrl,
      posterUrl,
      durationSec: job.result.duration,
      width: job.result.width,
      height: job.result.height
    };
  }
  
  // Server job
  const url = `${API_BASE}/api/result?jobId=${encodeURIComponent(jobId)}`;
  const response = await fetch(url);
  
  return handleResponse(response, ResultSchema);
}