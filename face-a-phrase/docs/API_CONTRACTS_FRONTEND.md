## API Contracts (Frontend → Backend-ready)

Single source of truth for request/response schemas used by the frontend. Implemented today as mock functions in `src/lib/api.ts`; backend should conform to these.

### POST /api/generate
- Content-Type: multipart/form-data
- Body fields:
  - `selfie`: File (image/jpeg or image/png), ≤ 10 MB
  - `script`: string (≤ 200 chars)
  - `consent`: string `'true'`
- Response: `202 Accepted`

```ts
export type GenerateResponse = { jobId: string };
```

### GET /api/status?jobId=...
- Query: `jobId: string`
- Response:

```ts
export type Status = 'queued'|'processing'|'assembling'|'ready'|'error';
export interface StatusResponse {
  status: Status;
  progress?: number;     // 0-100
  etaSeconds?: number;   // integer seconds
  error?: string;
}
```

### GET /api/result?jobId=...
- Query: `jobId: string`
- Response:

```ts
export interface ResultResponse {
  videoUrl: string;   // http(s) URL
  posterUrl: string;  // http(s) URL
  durationSec: number;
  width: number;      // 1080
  height: number;     // 1920
}
```

### zod validators used in `lib/api.ts`

```ts
import { z } from 'zod';

export const GenerateResponseSchema = z.object({
  jobId: z.string().min(1),
});

export const StatusSchema = z.object({
  status: z.enum(['queued','processing','assembling','ready','error']),
  progress: z.number().int().min(0).max(100).optional(),
  etaSeconds: z.number().int().min(0).optional(),
  error: z.string().optional(),
});

export const ResultSchema = z.object({
  videoUrl: z.string().url(),
  posterUrl: z.string().url(),
  durationSec: z.number().int().positive(),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
});

export type TGenerateResponse = z.infer<typeof GenerateResponseSchema>;
export type TStatusResponse = z.infer<typeof StatusSchema>;
export type TResultResponse = z.infer<typeof ResultSchema>;
```

### Typed client wrappers (frontend)

```ts
export async function generateClip(formData: FormData): Promise<TGenerateResponse>;
export async function pollStatus(jobId: string): Promise<TStatusResponse>;
export async function getResult(jobId: string): Promise<TResultResponse>;
```

Notes:
- Backend should return stable JSON fields exactly matching schemas above.
- `generate` must respond with 202 and a `jobId`. Status polling cadence is ~2–3s.


