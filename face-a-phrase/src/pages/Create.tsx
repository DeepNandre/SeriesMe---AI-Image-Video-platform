import { useState, useCallback } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { SeriesButton } from '@/components/SeriesButton';
import UploadDropzone from '@/components/UploadDropzone';
import { SeriesTextArea } from '@/components/SeriesTextArea';
import { ConsentCheckbox } from '@/components/ConsentCheckbox';
import ProgressStepper from '@/components/ProgressStepper';
import { VideoPlayer } from '@/components/VideoPlayer';
import { useToast } from '@/hooks/use-toast';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { FLAGS } from '@/lib/flags';

type GenerationState = 'idle' | 'validating' | 'uploading' | 'queued' | 'processing' | 'assembling' | 'ready' | 'error';

interface GenerationData {
  jobId?: string;
  progress?: number;
  etaSeconds?: number;
  error?: string;
  videoUrl?: string;
  posterUrl?: string;
  duration?: number;
}

const Create = () => {
  const { toast } = useToast();
  const { user, isLoaded } = useUser();
  const [selfieFile, setSelfieFile] = useState<File | null>(null);
  const [script, setScript] = useState('');
  const [consent, setConsent] = useState(false);
  const [state, setState] = useState<GenerationState>('idle');
  const [generationData, setGenerationData] = useState<GenerationData>({});

  // Debug auth state
  console.log('🔐 Auth state:', { isLoaded, user: !!user, authEnabled: FLAGS.AUTH_ENABLED });

  const canGenerate = selfieFile && script.trim() && script.length <= 200 && consent;

  const handleFileSelect = useCallback((file: File) => {
    setSelfieFile(file);
    toast({
      title: "Selfie uploaded",
      description: "Looking good! Now add your sentence.",
    });
  }, [toast]);

  const handleGenerate = async () => {
    if (!canGenerate) return;

    console.log('🚀 Starting video generation...', { 
      script, 
      hasFile: !!selfieFile, 
      consent,
      authEnabled: FLAGS.AUTH_ENABLED,
      user: !!user 
    });

    setState('uploading');
    
    try {
      // Mock API call
      const formData = new FormData();
      formData.append('selfie', selfieFile!);
      formData.append('script', script);
      formData.append('consent', 'true');

      const { generateClip } = await import('@/lib/api');
      const { jobId } = await generateClip(formData);
      
      console.log('✅ Generation started:', { jobId });
      
      setGenerationData({ jobId });
      setState('queued');

      // Start polling for status
      pollStatus(jobId);
    } catch (error) {
      console.error('❌ Generation failed:', error);
      setState('error');
      const errorMessage = error instanceof Error ? error.message : 'Something went wrong. Try again or tweak your selfie/script.';
      setGenerationData({ error: errorMessage });
      
      toast({
        title: "Generation failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const pollStatus = async (jobId: string) => {
    try {
      console.log('🔄 Polling status for job:', jobId);
      
      const { pollStatus, getFinalResult } = await import('@/lib/api');
      const data = await pollStatus(jobId);

      console.log('📊 Status update:', data);

      setGenerationData(prev => ({ ...prev, ...data }));

      if (data.status === 'ready') {
        console.log('✅ Video generation complete!');
        setState('ready');
        // Get final result
        const result = await getFinalResult(jobId);
        console.log('🎬 Final result:', result);
        
        setGenerationData(prev => ({ ...prev, videoUrl: result.videoUrl, posterUrl: result.posterUrl, duration: result.durationSec }));
        
        // Save to IndexedDB
        try {
          console.log('💾 Saving video to library...');
          const { idbSet } = await import('@/lib/idb');
          
          const videoId = `video_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          const savedVideo = {
            id: videoId,
            filename: `seriesme_${new Date().toISOString().split('T')[0]}.webm`,
            thumbnail: result.posterUrl,
            duration: result.durationSec,
            createdAt: new Date(),
            script: script,
            videoUrl: result.videoUrl,
            width: result.width,
            height: result.height
          };
          
          await idbSet(videoId, savedVideo);
          console.log('✅ Video saved to library:', videoId);
          
          toast({
            title: "Video ready!",
            description: "Your talking-head clip is ready and saved to your library.",
          });
        } catch (error) {
          console.error('❌ Failed to save video to library:', error);
          toast({
            title: "Video ready!",
            description: "Your talking-head clip is ready to download.",
          });
        }
      } else if (data.status === 'error') {
        console.error('❌ Generation error:', data.error);
        setState('error');
        setGenerationData(prev => ({ ...prev, error: data.error || 'Generation failed' }));
        
        toast({
          title: "Generation failed",
          description: data.error || 'Generation failed',
          variant: "destructive",
        });
      } else {
        console.log('⏳ Status:', data.status, 'Progress:', data.progress);
        setState(data.status);
        // Continue polling
        setTimeout(() => pollStatus(jobId), 2000);
      }
    } catch (error) {
      console.error('❌ Polling error:', error);
      setState('error');
      const errorMessage = error instanceof Error ? error.message : 'Connection lost. Please try again.';
      setGenerationData({ error: errorMessage });
      
      toast({
        title: "Connection error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    setState('idle');
    setGenerationData({});
  };

  const handleReset = () => {
    setState('idle');
    setSelfieFile(null);
    setScript('');
    setConsent(false);
    setGenerationData({});
  };

  const handleDownload = () => {
    if (generationData.videoUrl) {
      const a = document.createElement('a');
      a.href = generationData.videoUrl;
      a.download = 'seriesme-video.mp4';
      a.click();
      
      toast({
        title: "Download started",
        description: "Your video is being downloaded.",
      });
    }
  };

  const handleSave = async () => {
    if (!generationData.videoUrl) return;
    const id = `v_${Date.now()}`;
    const item = {
      id,
      filename: `seriesme-${id}.mp4`,
      thumbnail: generationData.posterUrl || '/placeholder.svg',
      duration: generationData.duration || 0,
      createdAt: new Date(),
      script,
      videoUrl: generationData.videoUrl,
    };
    try {
      const { idbSet } = await import('@/lib/idb');
      await idbSet(item);
      toast({ title: 'Saved to Library', description: 'Find it in your Library tab.' });
    } catch {
      toast({ title: 'Save failed', description: 'Could not save video locally.' });
    }
  };

  const isGenerating = ['uploading', 'queued', 'processing', 'assembling'].includes(state);

  let content: JSX.Element;
  if (state === 'ready' && generationData.videoUrl) {
    content = (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Your video is ready!</h2>
          <p className="text-muted-foreground">Looks great in vertical format</p>
        </div>
        <VideoPlayer
          src={generationData.videoUrl}
          poster={generationData.posterUrl}
          duration={generationData.duration}
          onDownload={handleDownload}
          onShare={() => toast({ title: "Share feature", description: "Coming soon!" })}
          onSave={() => handleSave()}
        />
        <div className="flex gap-3">
          <SeriesButton variant="outline" size="lg" className="flex-1" onClick={handleReset}>
            Generate Another
          </SeriesButton>
          <SeriesButton asChild size="lg" className="flex-1">
            <Link to="/library">
              View in Library
            </Link>
          </SeriesButton>
        </div>
      </div>
    );
  } else if (isGenerating) {
    content = (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Creating your video...</h2>
          <p className="text-muted-foreground">This usually takes 2-3 minutes</p>
        </div>
        <ProgressStepper
          currentStage={state as any}
          progress={generationData.progress}
          etaSeconds={generationData.etaSeconds}
          error={generationData.error}
        />
        <SeriesButton variant="ghost" size="default" className="w-full" onClick={handleCancel}>
          Cancel
        </SeriesButton>
      </div>
    );
  } else {
    content = (
      <div className="space-y-10">
        <div className="relative">
          <div className="space-y-4 glass rounded-2xl p-6">
            <div className="flex items-center space-x-3">
              <h2 className="text-xl font-bold text-foreground">📸 Upload your selfie</h2>
              {selfieFile && <span className="text-green-500 text-lg">✅</span>}
            </div>
            <p className="text-sm text-muted-foreground font-medium">Clear headshot, good lighting, looking at camera</p>
            <UploadDropzone onFileSelect={handleFileSelect} accept={['image/jpeg', 'image/png']} maxSizeMB={10} disabled={isGenerating} />
          </div>
        </div>
        <div className="relative">
          <div className="space-y-4 glass rounded-2xl p-6">
            <div className="flex items-center space-x-3">
              <h2 className="text-xl font-bold text-foreground">💬 Your viral sentence</h2>
              {script.length > 0 && <span className="text-green-500 text-lg">✅</span>}
            </div>
            <p className="text-sm text-muted-foreground font-medium">One powerful sentence that will captivate your audience</p>
            <SeriesTextArea
              placeholder="Type your viral sentence here... (max 200 characters)"
              value={script}
              onChange={(e) => setScript(e.target.value)}
              maxLength={200}
              disabled={isGenerating}
              helpText="💡 Pro tip: Ask a question, share a secret, or make a bold statement!"
            />
          </div>
        </div>
        <div className="relative">
          <div className="space-y-4 glass rounded-2xl p-6">
            <div className="flex items-center space-x-3">
              <h2 className="text-xl font-bold text-foreground">🛡️ Consent & Ethics</h2>
              {consent && <span className="text-green-500 text-lg">✅</span>}
            </div>
            <ConsentCheckbox checked={consent} onChange={setConsent} disabled={isGenerating} />
          </div>
        </div>
        <div className="rounded-2xl p-6 border border-white/10 bg-white/5">
          <div className="flex items-center space-x-3 mb-2">
            <span className="text-lg">🔒</span>
            <p className="font-semibold text-foreground">Safe & Responsible AI</p>
          </div>
          <p className="text-sm text-muted-foreground">Personal use only • Consent required • Visible watermark • No public figures</p>
        </div>
        
        {FLAGS.USE_BROWSER_RENDERER && (
          <div className="rounded-2xl p-4 border border-green-500/20 bg-green-500/5">
            <div className="flex items-center space-x-3 mb-2">
              <span className="text-lg">🌐</span>
              <p className="font-semibold text-green-600">Free Browser Mode</p>
            </div>
            <p className="text-sm text-muted-foreground">
              Your video is processed directly in your browser for maximum privacy. 
              {FLAGS.ENABLE_TTS_ELEVENLABS 
                ? ' Premium TTS enabled.' 
                : ' WebM format • Add TTS API key for professional audio.'
              }
            </p>
          </div>
        )}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-2xl blur-md group-hover:blur-lg transition-all duration-300 opacity-75"></div>
          <SeriesButton
            variant="primary"
            size="lg"
            className={`relative w-full font-black text-lg py-6 rounded-2xl shadow-2xl transition-all duration-300 ${
              canGenerate ? 'bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white transform hover:scale-105' : 'bg-muted text-muted-foreground cursor-not-allowed'
            }`}
            disabled={!canGenerate}
            loading={isGenerating}
            onClick={handleGenerate}
          >
            {isGenerating ? '🎬 Creating Your Viral Video...' : canGenerate ? '🚀 CREATE MY VIRAL VIDEO!' : '⏳ Complete Steps Above'}
          </SeriesButton>
        </div>
        {state === 'error' && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
            <p className="text-destructive text-center font-medium">{generationData.error}</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="grain min-h-screen">
      <NavBar />
      <div className="container-page pt-24 pb-24">
        <div className="flex items-center justify-between mb-10">
          <a href="/" className="px-3 py-2 rounded-full border border-white/20 hover:bg-white/10">
            <ArrowLeft className="h-5 w-5" />
          </a>
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl font-extrabold">Create Magic</h1>
            <p className="text-xs text-muted-foreground">✨ Your viral video starts here</p>
          </div>
          <div className="w-11" />
        </div>
        {content}
        <Footer />
      </div>
    </div>
  );
};

export default Create;