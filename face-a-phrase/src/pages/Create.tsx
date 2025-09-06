import { useState, useCallback } from 'react';
import { ArrowLeft, X } from 'lucide-react';
import { SeriesButton } from '@/components/SeriesButton';
import UploadDropzone from '@/components/UploadDropzone';
import { SeriesTextArea } from '@/components/SeriesTextArea';
import { ConsentCheckbox } from '@/components/ConsentCheckbox';
import ProgressStepper from '@/components/ProgressStepper';
import { VideoPlayer } from '@/components/VideoPlayer';
import Navigation from '@/components/Navigation';
import { useToast } from '@/hooks/use-toast';

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
  const [selfieFile, setSelfieFile] = useState<File | null>(null);
  const [script, setScript] = useState('');
  const [consent, setConsent] = useState(false);
  const [state, setState] = useState<GenerationState>('idle');
  const [generationData, setGenerationData] = useState<GenerationData>({});

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

    setState('uploading');
    
    try {
      // Mock API call
      const formData = new FormData();
      formData.append('selfie', selfieFile!);
      formData.append('script', script);
      formData.append('consent', 'true');

      const { generateClip } = await import('@/lib/api');
      const { jobId } = await generateClip(formData);
      setGenerationData({ jobId });
      setState('queued');

      // Start polling for status
      pollStatus(jobId);
    } catch (error) {
      setState('error');
      setGenerationData({ error: 'Something went wrong. Try again or tweak your selfie/script.' });
    }
  };

  const pollStatus = async (jobId: string) => {
    try {
      const { pollStatus, getFinalResult } = await import('@/lib/api');
      const data = await pollStatus(jobId);

      setGenerationData(prev => ({ ...prev, ...data }));

      if (data.status === 'ready') {
        setState('ready');
        // Get final result
        const result = await getFinalResult(jobId);
        setGenerationData(prev => ({ ...prev, videoUrl: result.videoUrl, posterUrl: result.posterUrl, duration: result.durationSec }));
        
        toast({
          title: "Video ready!",
          description: "Your talking-head clip is ready to download.",
        });
      } else if (data.status === 'error') {
        setState('error');
        setGenerationData(prev => ({ ...prev, error: data.error || 'Generation failed' }));
      } else {
        setState(data.status);
        // Continue polling
        setTimeout(() => pollStatus(jobId), 2000);
      }
    } catch (error) {
      setState('error');
      setGenerationData({ error: 'Connection lost. Please try again.' });
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

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/10 pb-24 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 right-5 w-20 h-20 bg-primary/10 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-20 left-3 w-16 h-16 bg-accent/10 rounded-full blur-lg animate-pulse" style={{animationDelay: '1.5s'}}></div>
        </div>
        
        <div className="relative px-4 pt-8 max-w-md mx-auto">
          {/* Header - More Engaging */}
          <div className="flex items-center justify-between mb-12">
            <a href="/" className="p-3 hover:bg-white/50 rounded-xl transition-all duration-200 backdrop-blur-sm">
              <ArrowLeft className="h-5 w-5" />
            </a>
            <div className="text-center">
              <h1 className="text-2xl font-black text-foreground">Create Magic</h1>
              <p className="text-xs text-primary font-semibold">✨ Your viral video starts here</p>
            </div>
            <div className="w-11" /> {/* Spacer */}
          </div>

          {state === 'ready' && generationData.videoUrl ? (
            /* Preview Screen */
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

              <SeriesButton 
                variant="outline" 
                size="lg" 
                className="w-full"
                onClick={handleReset}
              >
                Generate Another
              </SeriesButton>
            </div>
          ) : isGenerating ? (
            /* Progress Screen */
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

              <SeriesButton 
                variant="ghost" 
                size="default"
                className="w-full"
                onClick={handleCancel}
              >
                Cancel
              </SeriesButton>
            </div>
          ) : (
            /* Upload Form - More Engaging */
            <div className="space-y-10">
              {/* Upload Selfie */}
              <div className="relative">
                <div className="absolute -top-2 -left-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">1</span>
                </div>
                <div className="space-y-4 bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-xl">
                  <div className="flex items-center space-x-3">
                    <h2 className="text-xl font-bold text-foreground">📸 Upload your selfie</h2>
                    {selfieFile && <span className="text-green-500 text-lg">✅</span>}
                  </div>
                  <p className="text-sm text-muted-foreground font-medium">
                    Clear headshot, good lighting, looking at camera
                  </p>
                  <UploadDropzone
                    onFileSelect={handleFileSelect}
                    accept={['image/jpeg', 'image/png']}
                    maxSizeMB={10}
                    disabled={isGenerating}
                  />
                </div>
              </div>

              {/* Script Input */}
              <div className="relative">
                <div className="absolute -top-2 -left-2 w-6 h-6 bg-accent rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">2</span>
                </div>
                <div className="space-y-4 bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-xl">
                  <div className="flex items-center space-x-3">
                    <h2 className="text-xl font-bold text-foreground">💬 Your viral sentence</h2>
                    {script.length > 0 && <span className="text-green-500 text-lg">✅</span>}
                  </div>
                  <p className="text-sm text-muted-foreground font-medium">
                    One powerful sentence that will captivate your audience
                  </p>
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

              {/* Consent */}
              <div className="relative">
                <div className="absolute -top-2 -left-2 w-6 h-6 bg-success rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">3</span>
                </div>
                <div className="space-y-4 bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-xl">
                  <div className="flex items-center space-x-3">
                    <h2 className="text-xl font-bold text-foreground">🛡️ Consent & Ethics</h2>
                    {consent && <span className="text-green-500 text-lg">✅</span>}
                  </div>
                  <ConsentCheckbox
                    checked={consent}
                    onChange={setConsent}
                    disabled={isGenerating}
                  />
                </div>
              </div>

              {/* Safety Note */}
              <div className="bg-gradient-to-r from-muted/50 to-primary/10 rounded-2xl p-6 border border-primary/20">
                <div className="flex items-center space-x-3 mb-2">
                  <span className="text-lg">🔒</span>
                  <p className="font-semibold text-foreground">Safe & Responsible AI</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  Personal use only • Consent required • Visible watermark • No public figures
                </p>
              </div>

              {/* Generate Button - More Exciting */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-2xl blur-md group-hover:blur-lg transition-all duration-300 opacity-75"></div>
                <SeriesButton
                  variant="primary"
                  size="lg"
                  className={`relative w-full font-black text-lg py-6 rounded-2xl shadow-2xl transition-all duration-300 ${
                    canGenerate 
                      ? 'bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white transform hover:scale-105' 
                      : 'bg-muted text-muted-foreground cursor-not-allowed'
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
                  <p className="text-destructive text-center font-medium">
                    {generationData.error}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      <Navigation />
    </>
  );
};

export default Create;