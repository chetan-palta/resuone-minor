import { useCallback, useState } from 'react';
import { Upload, FileText, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { ResumeData } from '@/types/resume';

interface ImportResumeProps {
  onParsed: (resume: ResumeData, suggestions: any[], atsScore: number) => void;
  onClose?: () => void;
}

export function ImportResume({ onParsed, onClose }: ImportResumeProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFile = useCallback(async (file: File) => {
    // Validate file
    if (!file.name.endsWith('.docx') && !file.name.endsWith('.pdf')) {
      toast({
        title: 'Invalid file type',
        description: 'Please upload a DOCX or PDF file',
        variant: 'destructive',
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'File size must be less than 10MB',
        variant: 'destructive',
      });
      return;
    }

    setSelectedFile(file);
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await fetch(`${apiUrl}/api/parse-resume`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Network error - is the server running?' }));
        throw new Error(error.detail || error.error || 'Failed to parse resume');
      }

      const data = await response.json();
      
      toast({
        title: 'Resume imported',
        description: 'Your resume has been loaded. Review and save.',
      });

      onParsed(data.parsedResume, data.suggestions, data.atsScore);
      onClose?.();
    } catch (error: any) {
      console.error('Import error:', error);
      const errorMessage = error.message || 'Failed to parse resume. Please try again.';
      const isNetworkError = errorMessage.includes('fetch') || errorMessage.includes('Network');
      
      toast({
        title: 'Import failed',
        description: isNetworkError 
          ? 'Cannot connect to server. Please ensure the backend server is running on port 3001.'
          : errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
      setSelectedFile(null);
    }
  }, [onParsed, onClose]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  }, [handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  }, [handleFile]);

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Import Resume</h3>
        {onClose && (
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragging
            ? 'border-primary bg-primary/5'
            : 'border-muted-foreground/25 hover:border-primary/50'
        }`}
      >
        {isUploading ? (
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">
              Parsing resume... This may take a moment.
            </p>
            {selectedFile && (
              <p className="text-xs text-muted-foreground">{selectedFile.name}</p>
            )}
          </div>
        ) : (
          <>
            <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-sm font-medium mb-2">
              Drag and drop your resume here
            </p>
            <p className="text-xs text-muted-foreground mb-4">
              or click to browse (DOCX or PDF, max 10MB)
            </p>
            <input
              type="file"
              accept=".docx,.pdf"
              onChange={handleFileInput}
              className="hidden"
              id="resume-upload"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => document.getElementById('resume-upload')?.click()}
            >
              <FileText className="w-4 h-4 mr-2" />
              Choose File
            </Button>
          </>
        )}
      </div>

      <div className="mt-4 text-xs text-muted-foreground">
        <p>Supported formats: DOCX, PDF</p>
        <p>Maximum file size: 10MB</p>
      </div>
    </Card>
  );
}

