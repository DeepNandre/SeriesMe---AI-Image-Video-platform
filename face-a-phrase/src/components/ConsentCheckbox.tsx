import { forwardRef } from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ConsentCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}

const ConsentCheckbox = forwardRef<HTMLInputElement, ConsentCheckboxProps>(
  ({ checked, onChange, disabled = false, className }, ref) => {
    const checkboxId = 'consent-checkbox';
    return (
      <div className={cn("flex items-start space-x-3", className)}>
        <div className="relative flex-shrink-0 mt-0.5">
          <input
            ref={ref}
            type="checkbox"
            id={checkboxId}
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            disabled={disabled}
            className="sr-only"
          />
          <div
            className={cn(
              "w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 cursor-pointer",
              checked 
                ? "bg-primary border-primary text-primary-foreground" 
                : "border-border hover:border-primary",
              disabled && "opacity-50 cursor-not-allowed"
            )}
            onClick={() => !disabled && onChange(!checked)}
            role="checkbox"
            aria-checked={checked}
            aria-labelledby={`${checkboxId}-label`}
          >
            {checked && <Check className="h-3 w-3" strokeWidth={3} />}
          </div>
        </div>
        
        <label 
          id={`${checkboxId}-label`}
          htmlFor={checkboxId}
          className={cn(
            "text-sm leading-relaxed cursor-pointer",
            disabled && "cursor-not-allowed opacity-50"
          )}
          onClick={() => !disabled && onChange(!checked)}
        >
          I confirm I'm the person in the selfie or have their explicit consent.{' '}
          <span className="font-medium">No public figures.</span>
        </label>
      </div>
    );
  }
);

ConsentCheckbox.displayName = 'ConsentCheckbox';

export { ConsentCheckbox };