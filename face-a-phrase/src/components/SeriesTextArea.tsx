import { forwardRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface SeriesTextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  maxLength?: number;
  showCounter?: boolean;
  helpText?: string;
  error?: string;
}

const SeriesTextArea = forwardRef<HTMLTextAreaElement, SeriesTextAreaProps>(
  ({ className, maxLength = 200, showCounter = true, helpText, error, value, onChange, ...props }, ref) => {
    const [charCount, setCharCount] = useState(String(value || '').length);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = e.target.value;
      setCharCount(newValue.length);
      if (onChange) {
        onChange(e);
      }
    };

    const isNearLimit = maxLength && charCount > maxLength * 0.8;
    const isOverLimit = maxLength && charCount > maxLength;

    return (
      <div className="space-y-2">
        <div className="relative">
          <textarea
            ref={ref}
            className={cn(
              "flex min-h-[120px] w-full rounded-lg border border-input bg-background px-4 py-3 text-base",
              "placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
              "disabled:cursor-not-allowed disabled:opacity-50 resize-none transition-all duration-200",
              error && "border-destructive focus:ring-destructive",
              className
            )}
            value={value}
            onChange={handleChange}
            maxLength={maxLength}
            {...props}
          />
          
          {showCounter && maxLength && (
            <div className={cn(
              "absolute bottom-3 right-4 text-xs transition-colors",
              isOverLimit ? "text-destructive font-medium" : 
              isNearLimit ? "text-warning" : "text-muted-foreground"
            )}>
              {charCount}/{maxLength}
            </div>
          )}
        </div>
        
        {error && (
          <p className="text-sm text-destructive font-medium">{error}</p>
        )}
        
        {helpText && !error && (
          <p className="text-sm text-muted-foreground">{helpText}</p>
        )}
      </div>
    );
  }
);

SeriesTextArea.displayName = 'SeriesTextArea';

export { SeriesTextArea };