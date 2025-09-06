import type { Handler } from '@netlify/functions'

export const handler: Handler = async (event) => {
  const jobId = event.queryStringParameters?.jobId
  if (!jobId) return { statusCode: 400, body: 'Missing jobId' }

  // Simulate staged statuses on each call based on time since jobId timestamp
  const tsStr = jobId.split('_')[1]
  const ts = Number(tsStr)
  const elapsed = Date.now() - (isNaN(ts) ? Date.now() : ts)

  let status: 'queued'|'processing'|'assembling'|'ready' = 'queued'
  let progress = 0
  let etaSeconds = 180
  if (elapsed > 5000) { status = 'processing'; progress = 25; etaSeconds = 120 }
  if (elapsed > 45000) { status = 'assembling'; progress = 75; etaSeconds = 30 }
  if (elapsed > 90000) { status = 'ready'; progress = 100; etaSeconds = 0 }

  return {
    statusCode: 200,
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ status, progress, etaSeconds })
  }
}


