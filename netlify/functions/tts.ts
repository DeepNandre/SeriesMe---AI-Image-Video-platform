import type { Handler } from '@netlify/functions'

interface TTSRequest {
  text: string
  apiKey?: string
  voiceId?: string
}

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ error: 'Method Not Allowed' })
    }
  }

  try {
    const { text, apiKey, voiceId }: TTSRequest = JSON.parse(event.body || '{}')

    if (!text?.trim()) {
      return {
        statusCode: 400,
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ error: 'Text is required' })
      }
    }

    if (text.length > 500) {
      return {
        statusCode: 400,
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ error: 'Text too long (max 500 characters)' })
      }
    }

    // Use provided API key or environment variable
    const elevenlabsApiKey = apiKey || process.env.ELEVENLABS_API_KEY

    if (!elevenlabsApiKey) {
      return {
        statusCode: 400,
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ 
          error: 'ElevenLabs API key not configured. Set ELEVENLABS_API_KEY in Netlify environment variables or enable browser TTS.' 
        })
      }
    }

    // Generate TTS using ElevenLabs
    const audioBuffer = await generateElevenLabsTTS(text, elevenlabsApiKey, voiceId)

    return {
      statusCode: 200,
      headers: {
        'content-type': 'audio/mpeg',
        'access-control-allow-origin': '*',
        'access-control-allow-headers': 'Content-Type',
        'access-control-allow-methods': 'POST',
        'cache-control': 'public, max-age=3600', // Cache for 1 hour
      },
      body: audioBuffer.toString('base64'),
      isBase64Encoded: true
    }

  } catch (error) {
    console.error('TTS generation failed:', error)
    
    return {
      statusCode: 500,
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ 
        error: error instanceof Error ? error.message : 'TTS generation failed'
      })
    }
  }
}

async function generateElevenLabsTTS(
  text: string, 
  apiKey: string, 
  voiceId?: string
): Promise<Buffer> {
  const defaultVoiceId = 'pNInz6obpgDQGcFmaJgB' // Default English voice
  const selectedVoiceId = voiceId || defaultVoiceId

  try {
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${selectedVoiceId}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': apiKey
      },
      body: JSON.stringify({
        text: text.trim(),
        model_id: 'eleven_monolingual_v1',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.5,
          style: 0.0,
          use_speaker_boost: true
        }
      })
    })

    if (!response.ok) {
      const errorBody = await response.text().catch(() => 'Unknown error')
      throw new Error(`ElevenLabs API error (${response.status}): ${errorBody}`)
    }

    const arrayBuffer = await response.arrayBuffer()
    
    if (arrayBuffer.byteLength === 0) {
      throw new Error('Received empty audio data from ElevenLabs')
    }

    return Buffer.from(arrayBuffer)

  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Network error connecting to ElevenLabs API')
    }
    
    throw error
  }
}

// Helper function to validate ElevenLabs API key format
function isValidApiKey(apiKey: string): boolean {
  return apiKey && typeof apiKey === 'string' && apiKey.length > 10
}