// AI Model Router - Free providers first, paid fallbacks
import { FLAGS } from '@/lib/flags';

export interface TTSProvider {
  name: string;
  generate: (text: string, options?: TTSOptions) => Promise<Blob>;
  isAvailable: () => boolean;
  cost: 'free' | 'paid';
  quality: 'basic' | 'good' | 'premium';
}

export interface TTSOptions {
  voice?: string;
  speed?: number;
  pitch?: number;
}

export interface FaceAnimationProvider {
  name: string;
  animate: (imageBlob: Blob, audioBlob: Blob, options?: FaceAnimationOptions) => Promise<Blob>;
  isAvailable: () => boolean;
  cost: 'free' | 'paid';
  quality: 'basic' | 'good' | 'premium';
}

export interface FaceAnimationOptions {
  resolution?: { width: number; height: number };
  fps?: number;
}

class ModelRouter {
  private ttsProviders: TTSProvider[] = [];
  private faceProviders: FaceAnimationProvider[] = [];

  constructor() {
    this.initializeProviders();
  }

  private initializeProviders() {
    // TTS Providers (ordered by preference: free first, then paid)
    this.ttsProviders = [
      new WebSpeechTTSProvider(),
      new EdgeTTSProvider(),
      ...(FLAGS.ENABLE_TTS_ELEVENLABS ? [new ElevenLabsTTSProvider()] : [])
    ];

    // Face Animation Providers  
    this.faceProviders = [
      new BrowserFaceAnimationProvider(), // Current Canvas-based fallback
      // TODO: Add SadTalker, MakeItTalk when available
      // TODO: Add paid providers when enabled
    ];
  }

  async generateTTS(text: string, options: TTSOptions = {}): Promise<Blob> {
    console.log('🎤 Generating TTS for text:', text.substring(0, 50) + '...');
    
    for (const provider of this.ttsProviders) {
      if (provider.isAvailable()) {
        try {
          console.log(`🎤 Trying TTS provider: ${provider.name} (${provider.cost}, ${provider.quality})`);
          const audioBlob = await provider.generate(text, options);
          console.log(`✅ TTS success with ${provider.name}:`, audioBlob.size, 'bytes');
          return audioBlob;
        } catch (error) {
          console.warn(`⚠️ TTS provider ${provider.name} failed:`, error);
        }
      } else {
        console.log(`❌ TTS provider ${provider.name} not available`);
      }
    }

    throw new Error('No TTS providers available');
  }

  async generateFaceAnimation(imageBlob: Blob, audioBlob: Blob, options: FaceAnimationOptions = {}): Promise<Blob> {
    console.log('🎭 Generating face animation...');
    
    for (const provider of this.faceProviders) {
      if (provider.isAvailable()) {
        try {
          console.log(`🎭 Trying face animation provider: ${provider.name} (${provider.cost}, ${provider.quality})`);
          const videoBlob = await provider.animate(imageBlob, audioBlob, options);
          console.log(`✅ Face animation success with ${provider.name}:`, videoBlob.size, 'bytes');
          return videoBlob;
        } catch (error) {
          console.warn(`⚠️ Face animation provider ${provider.name} failed:`, error);
        }
      } else {
        console.log(`❌ Face animation provider ${provider.name} not available`);
      }
    }

    throw new Error('No face animation providers available');
  }

  getAvailableProviders() {
    return {
      tts: this.ttsProviders.filter(p => p.isAvailable()),
      face: this.faceProviders.filter(p => p.isAvailable())
    };
  }
}

// Web Speech API TTS Provider (Free, Basic Quality)
class WebSpeechTTSProvider implements TTSProvider {
  name = 'WebSpeech';
  cost = 'free' as const;
  quality = 'basic' as const;

  isAvailable(): boolean {
    return 'speechSynthesis' in window;
  }

  async generate(text: string, options: TTSOptions = {}): Promise<Blob> {
    return new Promise((resolve, reject) => {
      if (!this.isAvailable()) {
        reject(new Error('Web Speech API not available'));
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      
      // Configure voice
      const voices = speechSynthesis.getVoices();
      const preferredVoice = voices.find(voice => 
        voice.lang.startsWith('en') && 
        (voice.name.includes('Female') || voice.name.includes('Samantha') || voice.name.includes('Alex'))
      ) || voices[0];
      
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      utterance.rate = options.speed || 1.0;
      utterance.pitch = options.pitch || 1.0;

      // Record the speech
      let audioChunks: BlobPart[] = [];
      
      // This is tricky - Web Speech API doesn't directly give us audio data
      // We need to use MediaRecorder to capture system audio or find an alternative
      // For now, let's create a basic implementation that records through mic
      
      utterance.onend = () => {
        // For basic implementation, we'll create a silent audio blob
        // In a real implementation, we'd need to capture the actual speech audio
        const audioContext = new AudioContext();
        const duration = text.length / 10; // Rough estimate
        const sampleRate = audioContext.sampleRate;
        const numSamples = duration * sampleRate;
        const audioBuffer = audioContext.createBuffer(1, numSamples, sampleRate);
        
        // Create a simple tone for now (replace with actual speech capture)
        const channelData = audioBuffer.getChannelData(0);
        for (let i = 0; i < numSamples; i++) {
          channelData[i] = Math.sin(2 * Math.PI * 440 * i / sampleRate) * 0.1; // 440Hz tone
        }

        // Convert to WAV blob
        const wavBlob = this.audioBufferToWav(audioBuffer);
        resolve(wavBlob);
      };

      utterance.onerror = (error) => {
        reject(new Error(`Speech synthesis error: ${error.error}`));
      };

      speechSynthesis.speak(utterance);
    });
  }

  private audioBufferToWav(buffer: AudioBuffer): Blob {
    const length = buffer.length;
    const sampleRate = buffer.sampleRate;
    const arrayBuffer = new ArrayBuffer(44 + length * 2);
    const view = new DataView(arrayBuffer);
    const channelData = buffer.getChannelData(0);

    // WAV header
    const writeString = (offset: number, string: string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };

    writeString(0, 'RIFF');
    view.setUint32(4, 36 + length * 2, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeString(36, 'data');
    view.setUint32(40, length * 2, true);

    // Convert float32 to int16
    let offset = 44;
    for (let i = 0; i < length; i++) {
      const sample = Math.max(-1, Math.min(1, channelData[i]));
      view.setInt16(offset, sample * 0x7FFF, true);
      offset += 2;
    }

    return new Blob([arrayBuffer], { type: 'audio/wav' });
  }
}

// Edge-TTS Provider (Free, Good Quality)
class EdgeTTSProvider implements TTSProvider {
  name = 'EdgeTTS';
  cost = 'free' as const;
  quality = 'good' as const;

  isAvailable(): boolean {
    // Edge-TTS requires a backend or web service
    // For now, return false until we implement it
    return false;
  }

  async generate(text: string, options: TTSOptions = {}): Promise<Blob> {
    throw new Error('Edge-TTS not implemented yet');
  }
}

// ElevenLabs TTS Provider (Paid, Premium Quality)
class ElevenLabsTTSProvider implements TTSProvider {
  name = 'ElevenLabs';
  cost = 'paid' as const;
  quality = 'premium' as const;

  isAvailable(): boolean {
    return !!import.meta.env.VITE_ELEVENLABS_API_KEY;
  }

  async generate(text: string, options: TTSOptions = {}): Promise<Blob> {
    const apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY;
    if (!apiKey) {
      throw new Error('ElevenLabs API key not configured');
    }

    const voiceId = options.voice || 'EXAVITQu4vr4xnSDxMaL'; // Default voice
    
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': apiKey
      },
      body: JSON.stringify({
        text: text,
        model_id: 'eleven_monolingual_v1',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.5,
          style: 0.5,
          use_speaker_boost: true
        }
      })
    });

    if (!response.ok) {
      throw new Error(`ElevenLabs API error: ${response.status}`);
    }

    return await response.blob();
  }
}

// Browser-based Face Animation (Current Canvas Implementation)
class BrowserFaceAnimationProvider implements FaceAnimationProvider {
  name = 'BrowserCanvas';
  cost = 'free' as const;
  quality = 'basic' as const;

  isAvailable(): boolean {
    return true;
  }

  async animate(imageBlob: Blob, audioBlob: Blob, options: FaceAnimationOptions = {}): Promise<Blob> {
    // This would use our current Canvas-based rendering
    // For now, just return the current implementation
    const { generateBrowserClip } = await import('@/lib/render/generateBrowserClip');
    
    // Convert blob to file for compatibility
    const imageFile = new File([imageBlob], 'image.jpg', { type: imageBlob.type });
    
    const result = await generateBrowserClip(imageFile, 'Generated with AI voice', audioBlob, {
      width: options.resolution?.width || 1080,
      height: options.resolution?.height || 1920,
      fps: options.fps || 30
    });

    return result.videoBlob;
  }
}

// Export singleton instance
export const modelRouter = new ModelRouter();