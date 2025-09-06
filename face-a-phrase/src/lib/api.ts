// Production API client for SeriesMe backend
import { z } from 'zod';

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
export async function generateClip(formData: FormData): Promise<GenerateResponse> {
  // Client-side validation
  validateGenerateInput(formData);
  
  const url = `${API_BASE}/api/generate`;
  const response = await fetch(url, {
    method: 'POST',
    body: formData,
  });
  
  return handleResponse(response, GenerateResponseSchema);
}

export async function pollStatus(jobId: string): Promise<StatusResponse> {
  if (!jobId) {
    throw new APIError('Job ID is required');
  }
  
  const url = `${API_BASE}/api/status?jobId=${encodeURIComponent(jobId)}`;
  const response = await fetch(url);
  
  return handleResponse(response, StatusSchema);
}

export async function getFinalResult(jobId: string): Promise<ResultResponse> {
  if (!jobId) {
    throw new APIError('Job ID is required');
  }
  
  const url = `${API_BASE}/api/result?jobId=${encodeURIComponent(jobId)}`;
  const response = await fetch(url);
  
  return handleResponse(response, ResultSchema);
}