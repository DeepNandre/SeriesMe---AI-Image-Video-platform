export interface AudioRecorderOptions {
  duration?: number; // Max recording duration in seconds
  sampleRate?: number;
  channelCount?: number;
}

export interface RecordingResult {
  blob: Blob;
  duration: number;
  url: string;
}

export class AudioRecorder {
  private mediaRecorder: MediaRecorder | null = null;
  private stream: MediaStream | null = null;
  private chunks: Blob[] = [];
  private startTime: number = 0;

  constructor(private options: AudioRecorderOptions = {}) {
    this.options = {
      duration: 20, // Max 20 seconds
      sampleRate: 44100,
      channelCount: 1,
      ...options
    };
  }

  async requestPermission(): Promise<boolean> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: this.options.sampleRate,
          channelCount: this.options.channelCount,
          echoCancellation: true,
          noiseSuppression: true
        }
      });
      stream.getTracks().forEach(track => track.stop()); // Just testing permission
      return true;
    } catch (error) {
      console.error('Microphone permission denied:', error);
      return false;
    }
  }

  async startRecording(): Promise<void> {
    if (this.mediaRecorder?.state === 'recording') {
      throw new Error('Recording already in progress');
    }

    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: this.options.sampleRate,
          channelCount: this.options.channelCount,
          echoCancellation: true,
          noiseSuppression: true
        }
      });

      this.mediaRecorder = new MediaRecorder(this.stream, {
        mimeType: this.getSupportedMimeType()
      });

      this.chunks = [];
      this.startTime = Date.now();

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.chunks.push(event.data);
        }
      };

      this.mediaRecorder.start(100); // Collect data every 100ms

      // Auto-stop after max duration
      if (this.options.duration) {
        setTimeout(() => {
          if (this.mediaRecorder?.state === 'recording') {
            this.stopRecording();
          }
        }, this.options.duration * 1000);
      }

    } catch (error) {
      throw new Error(`Failed to start recording: ${error}`);
    }
  }

  stopRecording(): Promise<RecordingResult> {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder || this.mediaRecorder.state !== 'recording') {
        reject(new Error('No active recording to stop'));
        return;
      }

      this.mediaRecorder.onstop = () => {
        const duration = (Date.now() - this.startTime) / 1000;
        const blob = new Blob(this.chunks, { type: this.getSupportedMimeType() });
        const url = URL.createObjectURL(blob);

        // Clean up
        if (this.stream) {
          this.stream.getTracks().forEach(track => track.stop());
          this.stream = null;
        }

        resolve({ blob, duration, url });
      };

      this.mediaRecorder.onerror = (event) => {
        reject(new Error(`Recording failed: ${event}`));
      };

      this.mediaRecorder.stop();
    });
  }

  private getSupportedMimeType(): string {
    const types = [
      'audio/webm;codecs=opus',
      'audio/webm',
      'audio/ogg;codecs=opus',
      'audio/ogg',
      'audio/wav'
    ];

    for (const type of types) {
      if (MediaRecorder.isTypeSupported(type)) {
        return type;
      }
    }

    return 'audio/webm'; // Fallback
  }

  isRecording(): boolean {
    return this.mediaRecorder?.state === 'recording';
  }

  cleanup(): void {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    this.mediaRecorder = null;
    this.chunks = [];
  }
}

// Helper function for TTS via Netlify Function
export async function generateTTSAudio(text: string, apiKey?: string): Promise<Blob> {
  if (!text?.trim()) {
    throw new Error('Text is required for TTS generation');
  }

  try {
    const response = await fetch('/api/tts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        text: text.trim(),
        ...(apiKey && { apiKey })
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`TTS failed: ${errorText}`);
    }

    const blob = await response.blob();
    if (blob.size === 0) {
      throw new Error('Received empty audio data');
    }

    return blob;
  } catch (error) {
    console.error('TTS generation failed:', error);
    throw new Error(`TTS generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Helper to get estimated audio duration from text (for timing)
export function estimateAudioDuration(text: string, wordsPerMinute: number = 150): number {
  const wordCount = text.split(/\s+/).length;
  const minutes = wordCount / wordsPerMinute;
  return Math.max(3, minutes * 60); // Minimum 3 seconds
}