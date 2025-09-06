// Mock API implementation for development
// Replace with real API calls when backend is ready
import { z } from 'zod';

const API_BASE = (import.meta.env.VITE_API_BASE_URL as string | undefined) || '';
// If running on Netlify, we can hit relative /api/* which redirects to functions
const useBackend = true;

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

// zod schemas (used by typed wrappers)
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

// Mock job storage
const mockJobs = new Map<string, {
  status: string;
  progress: number;
  etaSeconds: number;
  createdAt: number;
  script: string;
}>();

export async function generateVideo(formData: FormData): Promise<GenerateResponse> {
  const selfie = formData.get('selfie') as File;
  const script = formData.get('script') as string;
  const consent = formData.get('consent') as string;

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Validate inputs
  if (!selfie || !script || consent !== 'true') {
    throw new Error('Missing required fields');
  }

  // Validate file type
  if (!['image/jpeg', 'image/png'].includes(selfie.type)) {
    throw new Error('Please choose a JPG/PNG under 10 MB.');
  }

  // Validate file size (10MB limit)
  if (selfie.size > 10 * 1024 * 1024) {
    throw new Error('Please choose a JPG/PNG under 10 MB.');
  }

  // Validate script length
  if (script.length > 200) {
    throw new Error('Keep it under 200 characters.');
  }

  // Generate mock job ID
  const jobId = `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  // Store job data
  mockJobs.set(jobId, {
    status: 'queued',
    progress: 0,
    etaSeconds: 180, // 3 minutes
    createdAt: Date.now(),
    script,
  });

  return { jobId };
}

export async function getStatus(jobId: string): Promise<StatusResponse> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  const job = mockJobs.get(jobId);
  if (!job) {
    throw new Error('Job not found');
  }

  const now = Date.now();
  const elapsed = now - job.createdAt;

  // Simulate progression over time
  let status = job.status;
  let progress = job.progress;
  let etaSeconds = job.etaSeconds;

  // Simulate realistic progression
  if (elapsed > 5000 && status === 'queued') {
    status = 'processing';
    progress = 25;
    etaSeconds = 120;
  } else if (elapsed > 45000 && status === 'processing') {
    status = 'assembling';
    progress = 75;
    etaSeconds = 30;
  } else if (elapsed > 90000 && status === 'assembling') {
    status = 'ready';
    progress = 100;
    etaSeconds = 0;
  } else if (status === 'processing') {
    // Gradual progress during processing
    const processingProgress = Math.min(75, 25 + (elapsed - 5000) / 40000 * 50);
    progress = Math.floor(processingProgress);
    etaSeconds = Math.max(30, 120 - (elapsed - 5000) / 1000);
  } else if (status === 'assembling') {
    // Gradual progress during assembling
    const assemblingProgress = Math.min(100, 75 + (elapsed - 45000) / 45000 * 25);
    progress = Math.floor(assemblingProgress);
    etaSeconds = Math.max(0, 30 - (elapsed - 45000) / 1000);
  }

  // Update job status
  job.status = status;
  job.progress = progress;
  job.etaSeconds = Math.floor(etaSeconds);

  // Very small chance of error (for testing)
  if (Math.random() < 0.02 && elapsed > 10000) {
    return {
      status: 'error',
      error: 'Processing failed. Please try again with a different photo or script.'
    };
  }

  return {
    status: status as any,
    progress,
    etaSeconds: Math.floor(etaSeconds)
  };
}

export async function getResult(jobId: string): Promise<ResultResponse> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  const job = mockJobs.get(jobId);
  if (!job) {
    throw new Error('Job not found');
  }

  if (job.status !== 'ready') {
    throw new Error('Video not ready yet');
  }

  // Generate a simple base64 video data URL (this would be a real video URL in production)
  const mockVideoUrl = 'data:video/mp4;base64,AAAAIGZ0eXBpc29tAAACAGlzb21pc28yYXZjMW1wNDEAAAAIZnJlZQAABRttZGF0AAAC...';

  // Clean up job after a delay
  setTimeout(() => {
    mockJobs.delete(jobId);
  }, 300000); // 5 minutes

  return {
    videoUrl: mockVideoUrl,
    posterUrl: '/placeholder.svg',
    durationSec: Math.floor(Math.random() * 10) + 10, // 10-20 seconds
    width: 1080,
    height: 1920
  };
}

// Typed wrappers for backend-ready integration
export async function generateClip(formData: FormData): Promise<GenerateResponse> {
  if (useBackend) {
    const base = API_BASE || '';
    const r = await fetch(`${base}/api/generate`, { method: 'POST', body: formData });
    if (!r.ok) throw new Error('Generate failed');
    return GenerateResponseSchema.parse(await r.json());
  }
  const res = await generateVideo(formData);
  return GenerateResponseSchema.parse(res);
}

export async function pollStatus(jobId: string): Promise<StatusResponse> {
  if (useBackend) {
    const base = API_BASE || '';
    const r = await fetch(`${base}/api/status?jobId=${encodeURIComponent(jobId)}`);
    if (!r.ok) throw new Error('Status failed');
    return StatusSchema.parse(await r.json());
  }
  const res = await getStatus(jobId);
  return StatusSchema.parse(res);
}

export async function getFinalResult(jobId: string): Promise<ResultResponse> {
  if (useBackend) {
    const base = API_BASE || '';
    const r = await fetch(`${base}/api/result?jobId=${encodeURIComponent(jobId)}`);
    if (!r.ok) throw new Error('Result failed');
    return ResultSchema.parse(await r.json());
  }
  const res = await getResult(jobId);
  return ResultSchema.parse(res);
}