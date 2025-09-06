import { CanvasComposer, Caption } from './CanvasComposer';
import { estimateAudioDuration } from './AudioRecorder';

export interface BrowserClipOptions {
  width?: number;
  height?: number;
  fps?: number;
  kenBurnsEffect?: boolean;
  watermarkText?: string;
  maxDuration?: number;
}

export interface BrowserClipResult {
  videoBlob: Blob;
  posterBlob: Blob;
  duration: number;
  width: number;
  height: number;
  format: string;
}

export async function generateBrowserClip(
  selfieFile: File,
  text: string,
  audioBlob?: Blob,
  options: BrowserClipOptions = {}
): Promise<BrowserClipResult> {
  const opts = {
    width: 1080,
    height: 1920,
    fps: 30,
    kenBurnsEffect: true,
    watermarkText: 'SeriesMe',
    maxDuration: 20,
    ...options
  };

  // Validate inputs
  if (!selfieFile) {
    throw new Error('Selfie file is required');
  }
  
  if (!text?.trim()) {
    throw new Error('Script text is required');
  }

  if (text.length > 200) {
    throw new Error('Script text must be under 200 characters');
  }

  try {
    console.log('🎨 Starting browser video generation...', { text, hasAudio: !!audioBlob });
    
    // Load selfie image
    console.log('📸 Loading selfie image...');
    const selfieImage = await loadImageFromFile(selfieFile);
    console.log('✅ Selfie loaded:', { width: selfieImage.width, height: selfieImage.height });
    
    // Calculate duration based on audio or text length
    let duration: number;
    let audioUrl: string | undefined;
    
    if (audioBlob) {
      console.log('🎵 Getting audio duration...');
      duration = await getAudioDuration(audioBlob);
      audioUrl = URL.createObjectURL(audioBlob);
      console.log('✅ Audio duration:', duration);
    } else {
      duration = estimateAudioDuration(text, 120); // 120 WPM for reading
      console.log('📝 Estimated duration from text:', duration);
    }
    
    // Cap duration
    duration = Math.min(duration, opts.maxDuration);
    console.log('⏱️ Final duration:', duration);
    
    // Generate captions
    console.log('📝 Generating captions...');
    const captions = CanvasComposer.generateCaptions(text, duration);
    console.log('✅ Captions generated:', captions.length);
    
    // Create video
    console.log('🎬 Creating video with canvas...');
    const { videoBlob, posterBlob } = await createVideoWithCanvas(
      selfieImage,
      duration,
      captions,
      audioUrl,
      opts
    );
    console.log('✅ Video created:', { videoSize: videoBlob.size, posterSize: posterBlob.size });

    // Cleanup object URLs
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }

    return {
      videoBlob,
      posterBlob,
      duration,
      width: opts.width,
      height: opts.height,
      format: 'webm'
    };

  } catch (error) {
    console.error('Browser clip generation failed:', error);
    throw new Error(`Video generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

async function loadImageFromFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load selfie image'));
    };
    
    img.src = url;
  });
}

async function getAudioDuration(audioBlob: Blob): Promise<number> {
  return new Promise((resolve, reject) => {
    const audio = new Audio();
    const url = URL.createObjectURL(audioBlob);
    
    audio.onloadedmetadata = () => {
      URL.revokeObjectURL(url);
      resolve(audio.duration);
    };
    
    audio.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to get audio duration'));
    };
    
    audio.src = url;
  });
}

async function createVideoWithCanvas(
  image: HTMLImageElement,
  duration: number,
  captions: Caption[],
  audioUrl: string | undefined,
  options: BrowserClipOptions
): Promise<{ videoBlob: Blob; posterBlob: Blob }> {
  
  console.log('🎨 Creating CanvasComposer...', { 
    width: options.width, 
    height: options.height, 
    fps: options.fps,
    duration 
  });
  
  const composer = new CanvasComposer({
    width: options.width,
    height: options.height,
    fps: options.fps,
    kenBurnsEffect: options.kenBurnsEffect,
    watermarkText: options.watermarkText
  });

  console.log('📹 Getting video stream from canvas...');
  // Get video stream from canvas
  const videoStream = composer.captureStream(options.fps);
  console.log('✅ Video stream created:', { 
    videoTracks: videoStream.getVideoTracks().length,
    audioTracks: videoStream.getAudioTracks().length 
  });
  
  // Add audio track if provided
  let finalStream = videoStream;
  if (audioUrl) {
    try {
      const audio = new Audio(audioUrl);
      const audioContext = new AudioContext();
      const source = audioContext.createMediaElementSource(audio);
      const dest = audioContext.createMediaStreamDestination();
      source.connect(dest);
      
      // Combine video and audio streams
      const audioTrack = dest.stream.getAudioTracks()[0];
      if (audioTrack) {
        finalStream = new MediaStream([
          ...videoStream.getVideoTracks(),
          audioTrack
        ]);
      }
    } catch (error) {
      console.warn('Failed to add audio track, continuing with video only:', error);
    }
  }

  // Set up MediaRecorder
  const mimeType = getSupportedMimeType();
  console.log('🎥 Setting up MediaRecorder with mimeType:', mimeType);
  
  const mediaRecorder = new MediaRecorder(finalStream, {
    mimeType,
    videoBitsPerSecond: 2500000 // 2.5 Mbps for good quality
  });

  const chunks: Blob[] = [];
  
  return new Promise((resolve, reject) => {
    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunks.push(event.data);
        console.log('📦 Data chunk received:', event.data.size, 'bytes');
      }
    };

    mediaRecorder.onstop = async () => {
      try {
        console.log('🛑 MediaRecorder stopped, processing chunks...', chunks.length);
        const videoBlob = new Blob(chunks, { type: mimeType });
        console.log('✅ Video blob created:', videoBlob.size, 'bytes');
        
        // Generate poster by drawing current frame
        console.log('🖼️ Generating poster...');
        await composer.drawFrame(image, duration * 0.3, duration, captions); // 30% through
        const posterBlob = await canvasToBlob(composer.getCanvas(), 'image/jpeg', 0.9);
        console.log('✅ Poster blob created:', posterBlob.size, 'bytes');
        
        // Cleanup
        composer.dispose();
        finalStream.getTracks().forEach(track => track.stop());
        
        console.log('🎉 Video generation complete!');
        resolve({ videoBlob, posterBlob });
      } catch (error) {
        console.error('❌ Error in onstop:', error);
        reject(error);
      }
    };

    mediaRecorder.onerror = (event) => {
      console.error('❌ MediaRecorder error:', event);
      reject(new Error(`MediaRecorder error: ${event}`));
    };

    // Start recording
    console.log('▶️ Starting MediaRecorder...');
    mediaRecorder.start(100); // Collect data every 100ms

    // Animate frames
    const startTime = Date.now();
    const fps = options.fps || 30;
    const frameInterval = 1000 / fps;
    
    console.log('🎬 Starting animation loop...', { fps, frameInterval, duration });
    
    const animateFrame = async () => {
      const elapsed = (Date.now() - startTime) / 1000;
      
      if (elapsed >= duration) {
        console.log('🏁 Animation complete, stopping MediaRecorder...');
        mediaRecorder.stop();
        return;
      }

      try {
        await composer.drawFrame(image, elapsed, duration, captions);
      } catch (error) {
        console.error('❌ Error drawing frame:', error);
      }
      
      setTimeout(animateFrame, frameInterval);
    };

    animateFrame();
    
    // Safety timeout
    setTimeout(() => {
      if (mediaRecorder.state === 'recording') {
        mediaRecorder.stop();
      }
    }, (duration + 2) * 1000);
  });
}

function getSupportedMimeType(): string {
  const types = [
    'video/webm;codecs=vp9,opus',
    'video/webm;codecs=vp8,opus', 
    'video/webm;codecs=h264,opus',
    'video/webm',
    'video/mp4'
  ];

  for (const type of types) {
    if (MediaRecorder.isTypeSupported(type)) {
      return type;
    }
  }

  return 'video/webm'; // Fallback
}

function canvasToBlob(canvas: HTMLCanvasElement, type: string = 'image/png', quality?: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error('Failed to create blob from canvas'));
      }
    }, type, quality);
  });
}