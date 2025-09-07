export interface ComposerOptions {
  width: number;
  height: number;
  fps: number;
  backgroundColor: string;
  kenBurnsEffect: boolean;
  watermarkText: string;
  captionStyle: CaptionStyle;
}

export interface CaptionStyle {
  fontFamily: string;
  fontSize: number;
  fontWeight: string;
  color: string;
  backgroundColor: string;
  padding: number;
  maxWidth: number;
  lineHeight: number;
}

export interface Caption {
  text: string;
  startTime: number;
  endTime: number;
}

export class CanvasComposer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private options: ComposerOptions;

  constructor(options: Partial<ComposerOptions> = {}) {
    this.options = {
      width: 1080,
      height: 1920,
      fps: 30,
      backgroundColor: '#000000',
      kenBurnsEffect: true,
      watermarkText: 'SeriesMe',
      captionStyle: {
        fontFamily: 'Arial, sans-serif',
        fontSize: 48,
        fontWeight: 'bold',
        color: '#ffffff',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        padding: 20,
        maxWidth: 900,
        lineHeight: 1.2
      },
      ...options
    };

    this.canvas = document.createElement('canvas');
    this.canvas.width = this.options.width;
    this.canvas.height = this.options.height;
    
    const ctx = this.canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Could not get canvas 2D context');
    }
    this.ctx = ctx;

    // Set high-quality rendering
    this.ctx.imageSmoothingEnabled = true;
    this.ctx.imageSmoothingQuality = 'high';
  }

  async drawFrame(
    image: HTMLImageElement,
    currentTime: number,
    totalDuration: number,
    captions: Caption[]
  ): Promise<void> {
    try {
      // Clear canvas
      this.ctx.fillStyle = this.options.backgroundColor;
      this.ctx.fillRect(0, 0, this.options.width, this.options.height);

      // Draw image with Ken Burns effect
      await this.drawImageWithKenBurns(image, currentTime, totalDuration);

      // Draw captions
      this.drawCaptions(captions, currentTime);

      // Draw watermark
      this.drawWatermark();
    } catch (error) {
      console.error('❌ Error in drawFrame:', error);
      throw new Error(`Canvas drawing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async drawImageWithKenBurns(
    image: HTMLImageElement,
    currentTime: number,
    totalDuration: number
  ): Promise<void> {
    try {
      const progress = totalDuration > 0 ? currentTime / totalDuration : 0;
      
      // Validate image is loaded
      if (!image.complete || image.naturalWidth === 0) {
        console.warn('⚠️ Image not fully loaded, skipping frame');
        return;
      }
      
      // Calculate image dimensions to fit canvas while maintaining aspect ratio
      const canvasAspect = this.options.width / this.options.height;
      const imageAspect = image.width / image.height;
      
      let drawWidth, drawHeight;
      if (imageAspect > canvasAspect) {
        // Image is wider - fit to height
        drawHeight = this.options.height;
        drawWidth = drawHeight * imageAspect;
      } else {
        // Image is taller - fit to width  
        drawWidth = this.options.width;
        drawHeight = drawWidth / imageAspect;
      }

      if (this.options.kenBurnsEffect) {
        // Ken Burns: gentle zoom and pan
        const zoomFactor = 1 + (progress * 0.2); // Zoom from 1x to 1.2x
        const panX = (progress - 0.5) * 100; // Pan horizontally
        const panY = (progress - 0.5) * 50; // Pan vertically (less)

        drawWidth *= zoomFactor;
        drawHeight *= zoomFactor;

        const x = (this.options.width - drawWidth) / 2 + panX;
        const y = (this.options.height - drawHeight) / 2 + panY;

        this.ctx.drawImage(image, x, y, drawWidth, drawHeight);
      } else {
        // Static centered image
        const x = (this.options.width - drawWidth) / 2;
        const y = (this.options.height - drawHeight) / 2;
        this.ctx.drawImage(image, x, y, drawWidth, drawHeight);
      }
    } catch (error) {
      console.error('❌ Error drawing image:', error);
      throw error;
    }
  }

  private drawCaptions(captions: Caption[], currentTime: number): void {
    // Find active caption
    const activeCaption = captions.find(
      cap => currentTime >= cap.startTime && currentTime <= cap.endTime
    );

    if (!activeCaption) return;

    const style = this.options.captionStyle;
    this.ctx.font = `${style.fontWeight} ${style.fontSize}px ${style.fontFamily}`;
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';

    // Wrap text to fit width
    const words = activeCaption.text.split(' ');
    const lines: string[] = [];
    let currentLine = '';

    for (const word of words) {
      const testLine = currentLine + (currentLine ? ' ' : '') + word;
      const metrics = this.ctx.measureText(testLine);
      
      if (metrics.width <= style.maxWidth) {
        currentLine = testLine;
      } else {
        if (currentLine) lines.push(currentLine);
        currentLine = word;
      }
    }
    if (currentLine) lines.push(currentLine);

    // Calculate total text height
    const lineHeight = style.fontSize * style.lineHeight;
    const totalTextHeight = lines.length * lineHeight;
    
    // Position near bottom of canvas
    const startY = this.options.height - 200 - totalTextHeight / 2;

    // Draw background for all lines
    const bgWidth = Math.max(...lines.map(line => this.ctx.measureText(line).width)) + style.padding * 2;
    const bgHeight = totalTextHeight + style.padding * 2;
    const bgX = (this.options.width - bgWidth) / 2;
    const bgY = startY - style.padding;

    this.ctx.fillStyle = style.backgroundColor;
    this.ctx.fillRect(bgX, bgY, bgWidth, bgHeight);

    // Draw text lines
    this.ctx.fillStyle = style.color;
    lines.forEach((line, index) => {
      const y = startY + (index * lineHeight);
      this.ctx.fillText(line, this.options.width / 2, y);
    });
  }

  private drawWatermark(): void {
    this.ctx.font = 'bold 32px Arial, sans-serif';
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    this.ctx.textAlign = 'right';
    this.ctx.textBaseline = 'bottom';
    
    const x = this.options.width - 40;
    const y = this.options.height - 40;
    
    // Draw semi-transparent background
    const metrics = this.ctx.measureText(this.options.watermarkText);
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    this.ctx.fillRect(x - metrics.width - 20, y - 40, metrics.width + 20, 45);
    
    // Draw watermark text
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    this.ctx.fillText(this.options.watermarkText, x - 10, y - 10);
  }

  getCanvas(): HTMLCanvasElement {
    return this.canvas;
  }

  captureStream(fps?: number): MediaStream {
    const frameRate = fps || this.options.fps;
    return this.canvas.captureStream(frameRate);
  }

  // Generate captions with timing based on text length
  static generateCaptions(text: string, duration: number): Caption[] {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim());
    if (sentences.length === 0) {
      return [{ text: text.trim(), startTime: 0, endTime: duration }];
    }

    const captions: Caption[] = [];
    const timePerSentence = duration / sentences.length;

    sentences.forEach((sentence, index) => {
      const startTime = index * timePerSentence;
      const endTime = (index + 1) * timePerSentence;
      captions.push({
        text: sentence.trim(),
        startTime,
        endTime
      });
    });

    return captions;
  }

  dispose(): void {
    // Clean up resources
    this.canvas.width = 0;
    this.canvas.height = 0;
  }
}