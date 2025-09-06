import { useState, useCallback } from 'react';
import { Upload, X, CheckCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UploadDropzoneProps {
  onFileSelect: (file: File) => void;
  accept: string[];
  maxSizeMB: number;
  className?: string;
  disabled?: boolean;
}

export default function UploadDropzone({ 
  onFileSelect, 
  accept, 
  maxSizeMB, 
  className,
  disabled = false 
}: UploadDropzoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const validateFile = useCallback((file: File): string | null => {
    // Check file type
    const fileType = file.type.toLowerCase();
    const acceptedTypes = accept.map(type => type.toLowerCase());
    if (!acceptedTypes.some(type => fileType.includes(type.replace('image/', '')))) {
      return `Please choose a ${accept.join(' or ')} file.`;
    }

    // Check file size
    const sizeInMB = file.size / (1024 * 1024);
    if (sizeInMB > maxSizeMB) {
      return `File size must be under ${maxSizeMB} MB.`;
    }

    return null;
  }, [accept, maxSizeMB]);

  const handleFileSelect = useCallback((file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setSelectedFile(file);
    onFileSelect(file);
  }, [validateFile, onFileSelect]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (disabled) return;

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [disabled, handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragOver(true);
    }
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  const clearFile = useCallback(() => {
    setSelectedFile(null);
    setError(null);
  }, []);

  return (
    <div className={cn("space-y-4", className)}>
      <div
        className={cn(
          "upload-zone relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300",
          isDragOver && "active",
          disabled && "opacity-50 cursor-not-allowed",
          selectedFile && !error && "border-success bg-success/5",
          error && "border-destructive bg-destructive/5"
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <input
          type="file"
          accept={accept.join(',')}
          onChange={handleInputChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={disabled}
          aria-label="Upload selfie"
        />
        
        <div className="space-y-4">
          {selectedFile && !error ? (
            <div className="flex items-center justify-center space-x-3">
              <CheckCircle className="h-8 w-8 text-success" />
              <div className="text-left">
                <p className="font-medium text-success">{selectedFile.name}</p>
                <p className="text-sm text-muted-foreground">
                  {(selectedFile.size / (1024 * 1024)).toFixed(1)} MB
                </p>
              </div>
              <button
                onClick={clearFile}
                className="ml-2 p-1 hover:bg-muted rounded-full transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center space-x-3">
              <AlertCircle className="h-8 w-8 text-destructive" />
              <div className="text-left">
                <p className="font-medium text-destructive">Upload Error</p>
                <p className="text-sm text-muted-foreground">{error}</p>
              </div>
              <button
                onClick={() => setError(null)}
                className="ml-2 p-1 hover:bg-muted rounded-full transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <>
              <Upload className="h-12 w-12 mx-auto text-muted-foreground" />
              <div>
                <p className="text-lg font-medium">Drop your selfie here</p>
                <p className="text-sm text-muted-foreground mt-1">
                  or click to choose a file
                </p>
              </div>
              <div className="text-xs text-muted-foreground">
                {accept.join(', ').toUpperCase()} • Max {maxSizeMB} MB
              </div>
              <button
                type="button"
                className="mt-2 inline-flex items-center justify-center rounded-md px-3 py-2 bg-white/10 hover:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80"
                onClick={() => {}}
                aria-label="Open file picker"
              >
                Choose file
              </button>
            </>
          )}
        </div>
      </div>
      
      {selectedFile && !error && (
        <div className="text-xs text-muted-foreground">
          Use a clear headshot with good lighting for best results.
        </div>
      )}
      {error && (
        <div className="text-sm text-destructive" role="alert">{error}</div>
      )}
    </div>
  );
}