// Production API client for SeriesMe backend
import { z } from 'zod';
import { FLAGS } from './flags';
import { generateBrowserClip, BrowserClipResult } from './render/generateBrowserClip';

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

    console.log('🎨 Generating browser video with Canvas API...');
    
    // Generate the actual video
    const result = await generateBrowserClip(selfieFile, script);
    
    console.log('✅ Browser video generation complete!', { 
      duration: result.duration, 
      format: result.format,
      size: result.videoBlob.size 
    });

    // Complete
    job.status = 'ready';
    job.progress = 100;
    job.etaSeconds = 0;
    job.result = result;
    browserJobs.set(jobId, job);

    console.log('🎉 Job marked as ready in browserJobs:', jobId);

    // Auto-cleanup after 5 minutes
    setTimeout(() => {
      if (job.result) {
        URL.revokeObjectURL(job.result.videoBlob as any);
        URL.revokeObjectURL(job.result.posterBlob as any);
      }
      browserJobs.delete(jobId);
    }, 5 * 60 * 1000);

  } catch (error) {
    console.error('❌ Browser video generation failed:', error);
    job.status = 'error';
    job.error = error instanceof Error ? error.message : 'Video generation failed';
    browserJobs.set(jobId, job);
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
      throw new APIError('Job not found');
    }
    
    console.log('🔍 Polling browser job:', { jobId, status: job.status, progress: job.progress, hasResult: !!job.result });
    
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