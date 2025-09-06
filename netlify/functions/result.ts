import type { Handler } from '@netlify/functions'
import { jobs } from './generate'

export const handler: Handler = async (event) => {
  const jobId = event.queryStringParameters?.jobId
  if (!jobId) {
    return { 
      statusCode: 400, 
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ error: 'Missing jobId parameter' })
    }
  }

  try {
    const job = jobs.get(jobId)
    
    if (!job) {
      return {
        statusCode: 404,
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ error: 'Job not found' })
      }
    }

    if (job.status !== 'ready') {
      return {
        statusCode: 409,
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ error: 'Video not ready yet' })
      }
    }

    const response = {
      videoUrl: job.videoUrl!,
      posterUrl: job.posterUrl!,
      durationSec: job.durationSec!,
      width: job.width!,
      height: job.height!
    }

    return {
      statusCode: 200,
      headers: {
        'content-type': 'application/json',
        'access-control-allow-origin': '*',
        'access-control-allow-headers': 'Content-Type',
        'access-control-allow-methods': 'GET',
      },
      body: JSON.stringify(response)
    }

  } catch (error) {
    console.error('Result error:', error)
    return {
      statusCode: 500,
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ error: 'Internal server error' })
    }
  }
}


