import { useState, useEffect } from 'react';
import { Play, Download, Trash2, Copy, FolderOpen } from 'lucide-react';
import { SeriesButton } from '@/components/SeriesButton';
import Navigation from '@/components/Navigation';
import { useToast } from '@/hooks/use-toast';

interface SavedVideo {
  id: string;
  filename: string;
  thumbnail: string;
  duration: number;
  createdAt: Date;
  script: string;
  videoUrl: string;
  width?: number;
  height?: number;
}

const Library = () => {
  const { toast } = useToast();
  const [videos, setVideos] = useState<SavedVideo[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<SavedVideo | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { idbGetAll } = await import('@/lib/idb');
        const items = await idbGetAll<SavedVideo>();
        if (!cancelled) {
          // Ensure dates are revived
          const restored = items.map(v => ({ ...v, createdAt: new Date(v.createdAt) } as unknown as SavedVideo));
          setVideos(restored);
        }
      } catch {
        // fallback to empty
        if (!cancelled) setVideos([]);
      }
    })();
    return () => { cancelled = true };
  }, []);

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays} days ago`;
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleDownload = (video: SavedVideo) => {
    // Simulate download
    toast({
      title: "Download started",
      description: `Downloading ${video.filename}`,
    });
  };

  const handleDelete = (video: SavedVideo) => {
    setVideos(prev => prev.filter(v => v.id !== video.id));
    toast({
      title: "Video deleted",
      description: "Video removed from your library",
    });
  };

  const handleDuplicate = (video: SavedVideo) => {
    // Redirect to create page with prefilled data
    const params = new URLSearchParams({
      script: video.script
    });
    window.location.href = `/create?${params.toString()}`;
  };

  if (videos.length === 0) {
    return (
      <>
        <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/10 pb-24 relative overflow-hidden">
          {/* Animated Background */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-16 right-8 w-24 h-24 bg-primary/10 rounded-full blur-xl animate-pulse"></div>
            <div className="absolute bottom-32 left-6 w-20 h-20 bg-accent/10 rounded-full blur-lg animate-pulse" style={{animationDelay: '1s'}}></div>
          </div>
          
          <div className="relative px-4 pt-8 max-w-md mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-3xl font-black text-foreground">Your Video Library</h1>
              <p className="text-sm text-primary font-semibold">📚 Your viral content collection</p>
            </div>

            {/* Empty State - More Engaging */}
            <div className="flex flex-col items-center justify-center py-16 space-y-8">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl flex items-center justify-center shadow-2xl">
                  <FolderOpen className="h-12 w-12 text-primary" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-accent rounded-full flex items-center justify-center animate-bounce">
                  <span className="text-white text-xs font-bold">!</span>
                </div>
              </div>
              
              <div className="text-center space-y-4">
                <h2 className="text-2xl font-bold text-foreground">Your viral journey starts here!</h2>
                <p className="text-muted-foreground text-lg leading-relaxed max-w-xs">
                  🎬 Create your first amazing talking-head video and watch it appear in your personal collection
                </p>
              </div>

              <div className="relative group w-full">
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-2xl blur-md group-hover:blur-lg transition-all duration-300 opacity-75"></div>
                <SeriesButton 
                  variant="primary" 
                  size="xl"
                  className="relative w-full bg-gradient-to-r from-primary to-accent text-white font-black text-lg py-6 rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300"
                  onClick={() => window.location.href = '/create'}
                >
                  🚀 CREATE MY FIRST VIRAL VIDEO
                </SeriesButton>
              </div>
              
              <div className="text-center mt-8">
                <p className="text-xs text-muted-foreground/70">
                  ⚡ 5 minutes • 📱 Perfect for social • 🛡️ Safe & watermarked
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <Navigation />
      </>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/10 pb-24 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-16 right-8 w-24 h-24 bg-primary/10 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-32 left-6 w-20 h-20 bg-accent/10 rounded-full blur-lg animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>
        
        <div className="relative px-4 pt-8 max-w-md mx-auto">
          {/* Header - More Engaging */}
          <div className="flex items-center justify-between mb-12">
            <div>
              <h1 className="text-3xl font-black text-foreground">Your Videos</h1>
              <p className="text-sm text-primary font-semibold">🎬 Your viral content collection</p>
            </div>
            <div className="bg-primary/10 rounded-full px-3 py-1">
              <span className="text-sm font-bold text-primary">
                {videos.length} video{videos.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>

          {/* Video Grid - Better Layout */}
          <div className="space-y-6">
            {videos.map((video, index) => (
              <div 
                key={video.id}
                className="group relative bg-white/70 backdrop-blur-sm border border-white/50 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]"
              >
                {/* Video Preview */}
                <div className="flex items-start space-x-4">
                  <div className="relative flex-shrink-0">
                    <div className="w-20 h-36 bg-gradient-to-br from-muted to-muted/60 rounded-xl overflow-hidden shadow-lg">
                      <img 
                        src={video.thumbnail} 
                        alt={`Thumbnail for ${video.filename}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button 
                      className="absolute inset-0 bg-black/30 rounded-xl flex items-center justify-center text-white hover:bg-black/50 transition-all duration-200 group-hover:bg-black/40"
                      onClick={() => setSelectedVideo(video)}
                    >
                      <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                        <Play className="h-4 w-4 ml-0.5" />
                      </div>
                    </button>
                    
                    {/* Video Number Badge */}
                    <div className="absolute -top-2 -left-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-white text-xs font-bold">{index + 1}</span>
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0 space-y-3">
                    <div>
                      <p className="font-bold text-base text-foreground leading-snug mb-1">
                        "{video.script}"
                      </p>
                      <div className="flex items-center space-x-3 text-sm">
                        <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-semibold">
                          {formatDuration(video.duration)}
                        </span>
                        <span className="text-muted-foreground font-medium">
                          {formatDate(video.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions - Better Design */}
                <div className="mt-4 pt-4 border-t border-border/30">
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => handleDownload(video)}
                      className="bg-white/50 backdrop-blur-sm hover:bg-primary/10 border border-primary/20 text-primary font-semibold rounded-md px-2 py-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80"
                      aria-label={`Download ${video.filename}`}
                      title="Download"
                    >
                      <span className="inline-flex items-center"><Download className="h-3 w-3 mr-1" />Download</span>
                    </button>
                    
                    <button
                      onClick={() => handleDuplicate(video)}
                      className="bg-white/50 backdrop-blur-sm hover:bg-accent/10 border border-accent/20 text-accent font-semibold rounded-md px-2 py-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80"
                      aria-label={`Duplicate ${video.filename}`}
                      title="Duplicate"
                    >
                      <span className="inline-flex items-center"><Copy className="h-3 w-3 mr-1" />Duplicate</span>
                    </button>
                    
                    <button
                      onClick={() => handleDelete(video)}
                      className="bg-white/50 backdrop-blur-sm hover:bg-destructive/10 border border-destructive/20 text-destructive font-semibold rounded-md px-2 py-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80"
                      aria-label={`Delete ${video.filename}`}
                      title="Delete"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Action Button - More Engaging */}
          <div className="mt-12">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-2xl blur-md group-hover:blur-lg transition-all duration-300 opacity-75"></div>
              <SeriesButton 
                variant="primary" 
                size="xl"
                className="relative w-full bg-gradient-to-r from-primary to-accent text-white font-black text-lg py-6 rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300"
                onClick={() => window.location.href = '/create'}
              >
                ➕ CREATE ANOTHER VIRAL VIDEO
              </SeriesButton>
            </div>
          </div>
        </div>
      </div>
      
      <Navigation />
    </>
  );
};

export default Library;