import type { Handler } from '@netlify/functions'

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }
  // NOTE: Netlify functions provide body as raw; we keep a fake jobId and store client-side
  const jobId = `job_${Date.now()}_${Math.random().toString(36).slice(2,8)}`
  return {
    statusCode: 202,
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ jobId })
  }
}


