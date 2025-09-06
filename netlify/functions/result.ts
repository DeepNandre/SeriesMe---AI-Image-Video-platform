import type { Handler } from '@netlify/functions'

export const handler: Handler = async (event) => {
  const jobId = event.queryStringParameters?.jobId
  if (!jobId) return { statusCode: 400, body: 'Missing jobId' }

  // For pure serverless (no storage), return a placeholder video URL
  // You can later replace with object storage links (S3/R2)
  const videoUrl = 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4'
  const posterUrl = 'https://dummyimage.com/1080x1920/000/fff.jpg&text=SeriesMe'
  const body = { videoUrl, posterUrl, durationSec: 12, width: 1080, height: 1920 }
  return { statusCode: 200, headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) }
}


