import { forwardRef, useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Download, Share2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SeriesButton } from './SeriesButton';

interface VideoPlayerProps {
  src: string;
  poster?: string;
  muted?: boolean;
  controls?: boolean;
  autoPlay?: boolean;
  className?: string;
  onDownload?: () => void;
  onShare?: () => void;
  onSave?: (item: { id: string; filename: string; thumbnail: string; duration: number; createdAt: Date; script: string; videoUrl: string }) => void;
  duration?: number;
  resolution?: string;
}

const VideoPlayer = forwardRef<HTMLVideoElement, VideoPlayerProps>(
  ({ 
    src, 
    poster, 
    muted = true, 
    controls = false,
    autoPlay = false,
    className,
    onDownload,
    onShare,
    onSave,
    duration,
    resolution = "1080×1920",
    ...props 
  }, ref) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(muted);
    const [showControls, setShowControls] = useState(false);

    const togglePlay = () => {
      const video = ref as React.RefObject<HTMLVideoElement>;
      if (video.current) {
        if (isPlaying) {
          video.current.pause();
        } else {
          video.current.play();
        }
        setIsPlaying(!isPlaying);
      }
    };

    const toggleMute = () => {
      const video = ref as React.RefObject<HTMLVideoElement>;
      if (video.current) {
        video.current.muted = !isMuted;
        setIsMuted(!isMuted);
      }
    };

    const formatDuration = (seconds: number) => {
      const mins = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
      <div className={cn("space-y-4", className)}>
        {/* Video Container */}
        <div 
          className="video-container relative aspect-9/16 bg-video-bg rounded-lg overflow-hidden max-w-xs mx-auto"
          onMouseEnter={() => setShowControls(true)}
          onMouseLeave={() => setShowControls(false)}
        >
          <video
            ref={ref}
            src={src}
            poster={poster}
            preload="metadata"
            muted={isMuted}
            autoPlay={autoPlay}
            className="w-full h-full object-cover"
            onClick={togglePlay}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            {...props}
          />
          
          {/* Overlay Controls */}
          <div className={cn(
            "absolute inset-0 bg-black/20 flex items-center justify-center transition-opacity duration-300",
            showControls || !isPlaying ? "opacity-100" : "opacity-0"
          )}>
            <button
              onClick={togglePlay}
              className="w-16 h-16 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
            >
              {isPlaying ? (
                <Pause className="h-8 w-8 ml-0.5" />
              ) : (
                <Play className="h-8 w-8 ml-1" />
              )}
            </button>
          </div>

          {/* Bottom Controls */}
          <div className={cn(
            "absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity duration-300",
            showControls ? "opacity-100" : "opacity-0"
          )}>
            <div className="flex items-center justify-between text-white">
              <button
                onClick={toggleMute}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                {isMuted ? (
                  <VolumeX className="h-4 w-4" />
                ) : (
                  <Volume2 className="h-4 w-4" />
                )}
              </button>
              
              <div className="text-xs">
                {duration && formatDuration(duration)} • {resolution}
              </div>
            </div>
          </div>

          {/* Watermark */}
          <div className="absolute bottom-4 right-4 bg-black/50 px-2 py-1 rounded text-xs text-white pointer-events-none select-none">
            SeriesMe
          </div>
        </div>

        {/* Video Info */}
        {(duration || resolution) && (
          <div className="text-center space-y-1">
            <p className="text-sm text-muted-foreground">
              {duration && `Duration: ${formatDuration(duration)}`}
              {duration && resolution && " • "}
              {resolution && `Resolution: ${resolution}`}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col space-y-3">
          {onDownload && (
            <SeriesButton 
              variant="primary" 
              size="lg" 
              onClick={onDownload}
              className="w-full"
            >
              <Download className="h-4 w-4 mr-2" />
              Download MP4 (1080×1920)
            </SeriesButton>
          )}
          
          <div className="flex space-x-3">
            {onShare && (
              <SeriesButton 
                variant="outline" 
                size="default" 
                onClick={onShare}
                className="flex-1"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </SeriesButton>
            )}
            
            {onSave && (
              <SeriesButton 
                variant="ghost" 
                size="default"
                className="flex-1"
                onClick={() => {
                  const id = `v_${Date.now()}`;
                  onSave({
                    id,
                    filename: `seriesme-${id}.mp4`,
                    thumbnail: poster || '/placeholder.svg',
                    duration: duration || 0,
                    createdAt: new Date(),
                    script: '',
                    videoUrl: src,
                  });
                }}
              >
                Save to Library
              </SeriesButton>
            )}
          </div>
        </div>
      </div>
    );
  }
);

VideoPlayer.displayName = 'VideoPlayer';

export { VideoPlayer };