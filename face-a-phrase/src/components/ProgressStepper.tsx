import { Check, Upload, Clock, Cog, Film, Download } from 'lucide-react';
import { cn } from '@/lib/utils';

type ProgressStage = 'uploading' | 'queued' | 'processing' | 'assembling' | 'ready' | 'error';

interface ProgressStepperProps {
  currentStage: ProgressStage;
  progress?: number; // 0-100
  etaSeconds?: number;
  error?: string;
  className?: string;
}

const stages = [
  { key: 'uploading', label: 'Uploading', icon: Upload },
  { key: 'queued', label: 'Queued', icon: Clock },
  { key: 'processing', label: 'Processing', icon: Cog },
  { key: 'assembling', label: 'Assembling', icon: Film },
  { key: 'ready', label: 'Ready', icon: Download },
] as const;

export default function ProgressStepper({ 
  currentStage, 
  progress = 0, 
  etaSeconds, 
  error,
  className 
}: ProgressStepperProps) {
  const currentStageIndex = stages.findIndex(stage => stage.key === currentStage);
  
  const formatETA = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`;
  };

  if (error) {
    return (
      <div className={cn("space-y-4", className)}>
        <div className="flex items-center justify-center p-6 bg-destructive/10 border border-destructive/20 rounded-lg">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-3 bg-destructive/20 rounded-full flex items-center justify-center">
              <span className="text-destructive text-xl">!</span>
            </div>
            <p className="font-medium text-destructive mb-1">Generation Failed</p>
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Progress Bar */}
      <div className="space-y-2" role="status" aria-live="polite" aria-atomic="true">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">
            {stages[currentStageIndex]?.label || 'Processing'}...
          </span>
          {etaSeconds && (
            <span className="text-sm text-muted-foreground">
              ~{formatETA(etaSeconds)} remaining
            </span>
          )}
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div 
            className="progress-bar bg-primary h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${Math.max(progress, (currentStageIndex + 1) * 20)}%` }}
          />
        </div>
      </div>

      {/* Stage Indicators */}
      <div className="flex justify-between">
        {stages.map((stage, index) => {
          const isCompleted = index < currentStageIndex;
          const isCurrent = index === currentStageIndex;
          const isPending = index > currentStageIndex;
          
          const Icon = stage.icon;
          
          return (
            <div key={stage.key} className="flex flex-col items-center space-y-2">
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300",
                isCompleted && "bg-success text-success-foreground",
                isCurrent && "bg-primary text-primary-foreground animate-pulse",
                isPending && "bg-muted text-muted-foreground"
              )}>
                {isCompleted ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <Icon className={cn(
                    "h-5 w-5",
                    isCurrent && "animate-spin"
                  )} />
                )}
              </div>
              <span className={cn(
                "text-xs text-center font-medium transition-colors",
                isCompleted && "text-success",
                isCurrent && "text-primary",
                isPending && "text-muted-foreground"
              )}>
                {stage.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Helpful Tips */}
      <div className="bg-muted/50 rounded-lg p-4">
        <p className="text-sm text-muted-foreground text-center">
          {currentStage === 'uploading' && "Uploading your selfie..."}
          {currentStage === 'queued' && "Your video is in the queue. This usually takes 1-2 minutes."}
          {currentStage === 'processing' && "AI is analyzing your selfie and creating the talking head..."}
          {currentStage === 'assembling' && "Adding captions and finalizing your video..."}
          {currentStage === 'ready' && "Your video is ready! You can switch tabs - we'll notify you when it's done."}
        </p>
      </div>
    </div>
  );
}