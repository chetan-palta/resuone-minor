import { useState, useEffect, useCallback } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { FileText, Download, RotateCcw, Eye, EyeOff, Settings2, Save, ArrowLeft, Upload, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useResumeStore } from "@/hooks/useResumeStore";
import { useAuth } from "@/hooks/useAuth";
import { ResumeForm } from "@/components/resume/ResumeForm";
import { ResumePreview } from "@/components/resume/ResumePreview";
import { ExportDialog } from "@/components/resume/ExportDialog";
import { TemplateSelector } from "@/components/resume/TemplateSelector";
import { ImportResume } from "@/components/resume/ImportResume";
import { SuggestionsPanel } from "@/components/resume/SuggestionsPanel";
import { ThemeToggle } from "@/components/ThemeToggle";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ResumeData } from "@/types/resume";

export default function Editor() {
  const store = useResumeStore();
  const { user, isAuthenticated } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [showPreview, setShowPreview] = useState(true);
  const [exportOpen, setExportOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [atsScore, setAtsScore] = useState(0);
  const [resumeId, setResumeId] = useState<string | null>(null);
  const [resumeTitle, setResumeTitle] = useState("Untitled Resume");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Load resume from database if id is provided
  useEffect(() => {
    const id = searchParams.get('id');
    if (id && isAuthenticated) {
      setResumeId(id);
      loadResume(id);
    }
  }, [searchParams, isAuthenticated]);

  const loadResume = async (id: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('resumes')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      
      if (data) {
        const resumeData = data.data as unknown as ResumeData;
        store.loadResume(resumeData);
        setResumeTitle(data.title);
      }
    } catch (error) {
      console.error('Error loading resume:', error);
      toast({
        title: "Error",
        description: "Failed to load resume",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveToDatabase = useCallback(async () => {
    if (!isAuthenticated) {
      toast({
        title: "Sign in required",
        description: "Please sign in to save your resume",
        variant: "destructive",
      });
      return;
    }

    if (!resumeId) {
      // Create new resume
      setIsSaving(true);
      try {
        // Check 5-resume limit
        const { data: existingResumes, error: countError } = await supabase
          .from('resumes')
          .select('id')
          .eq('user_id', user?.id);

        if (countError) throw countError;

        if (existingResumes && existingResumes.length >= 5) {
          toast({
            title: "Resume limit reached",
            description: "You can save up to 5 resumes. Please delete one to save a new one.",
            variant: "destructive",
          });
          setIsSaving(false);
          return;
        }

        const { data, error } = await supabase
          .from('resumes')
          .insert({
            title: resumeTitle,
            data: JSON.parse(JSON.stringify(store.resume)),
            template_id: store.resume.templateId,
            user_id: user?.id,
          })
          .select()
          .single();

        if (error) throw error;
        
        setResumeId(data.id);
        toast({
          title: "Saved",
          description: "Your resume has been saved",
        });
      } catch (error: any) {
        console.error('Error saving resume:', error);
        toast({
          title: "Error",
          description: error.message || "Failed to save resume",
          variant: "destructive",
        });
      } finally {
        setIsSaving(false);
      }
      return;
    }
    
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('resumes')
        .update({
          title: resumeTitle,
          data: JSON.parse(JSON.stringify(store.resume)),
          template_id: store.resume.templateId,
        })
        .eq('id', resumeId);

      if (error) throw error;
      
      toast({
        title: "Saved",
        description: "Your resume has been saved",
      });
    } catch (error) {
      console.error('Error saving resume:', error);
      toast({
        title: "Error",
        description: "Failed to save resume",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  }, [isAuthenticated, resumeId, resumeTitle, store.resume, user?.id]);

  const handleReset = () => {
    if (confirm("Are you sure you want to reset your resume? This cannot be undone.")) {
      store.resetResume();
      setSuggestions([]);
      setAtsScore(0);
      toast({
        title: "Resume Reset",
        description: "Your resume has been cleared.",
      });
    }
  };

  const handleImportParsed = (resume: ResumeData, importedSuggestions: any[], score: number) => {
    store.loadResume(resume);
    setSuggestions(importedSuggestions);
    setAtsScore(score);
    setShowSuggestions(true);
    setImportOpen(false);
  };

  const handleApplySuggestion = (suggestionId: string) => {
    // Apply suggestion logic would go here
    // For now, just mark as applied
    toast({
      title: "Suggestion applied",
      description: "The suggestion has been applied to your resume.",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background border-b border-border">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {resumeId ? (
              <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
                <ArrowLeft className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">Dashboard</span>
              </Button>
            ) : (
              <Link to="/" className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg gradient-hero flex items-center justify-center">
                  <FileText className="w-4 h-4 text-primary-foreground" />
                </div>
                <span className="text-lg font-bold text-foreground hidden sm:block">ResuOne</span>
              </Link>
            )}
            
            {resumeId && (
              <Input
                value={resumeTitle}
                onChange={(e) => setResumeTitle(e.target.value)}
                className="h-8 w-40 sm:w-56 text-sm"
                placeholder="Resume title"
              />
            )}
          </div>

          <div className="flex items-center gap-2">
            {!resumeId && store.lastSaved && (
              <span className="text-xs text-muted-foreground hidden sm:block">
                Saved {store.lastSaved.toLocaleTimeString()}
              </span>
            )}

            <ThemeToggle />
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setImportOpen(true)}
              title="Import Resume"
            >
              <Upload className="w-4 h-4" />
            </Button>

            {suggestions.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSuggestions(!showSuggestions)}
                title="View Suggestions"
              >
                <Lightbulb className="w-4 h-4" />
                {atsScore > 0 && (
                  <span className="ml-1 text-xs">{atsScore}</span>
                )}
              </Button>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowPreview(!showPreview)}
              className="md:hidden"
            >
              {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSettingsOpen(!settingsOpen)}
            >
              <Settings2 className="w-4 h-4" />
            </Button>

            <Button variant="ghost" size="sm" onClick={handleReset}>
              <RotateCcw className="w-4 h-4" />
            </Button>

            {isAuthenticated && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={saveToDatabase}
                disabled={isSaving}
              >
                <Save className="w-4 h-4" />
                <span className="hidden sm:inline ml-1">{isSaving ? 'Saving...' : resumeId ? 'Save' : 'Save to Dashboard'}</span>
              </Button>
            )}

            <Button size="sm" onClick={() => setExportOpen(true)}>
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline ml-1">Export</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Settings Panel */}
      {settingsOpen && (
        <div className="bg-background border-b border-border py-4">
          <div className="container mx-auto px-4">
            <TemplateSelector
              resume={store.resume}
              onUpdate={store.updateResume}
            />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Form Panel */}
        <div className={`flex-1 overflow-y-auto ${showPreview ? "hidden md:block md:w-1/2 lg:w-2/5" : "w-full"}`}>
          <div className="container mx-auto p-4 md:p-6 max-w-2xl">
            <ResumeForm store={store} />
          </div>
        </div>

        {/* Preview Panel */}
        <div className={`bg-muted/50 overflow-y-auto ${showPreview ? "flex-1" : "hidden"} relative`}>
          <div className="p-4 md:p-8 flex justify-center">
            <div className="w-full max-w-[850px]">
              <ResumePreview resume={store.resume} />
            </div>
          </div>
          
          {/* Suggestions Panel - Overlay on right side */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-4 right-4 w-80 max-h-[calc(100vh-8rem)] z-10">
              <SuggestionsPanel
                suggestions={suggestions}
                atsScore={atsScore}
                onApply={handleApplySuggestion}
                onIgnore={(id) => {
                  setSuggestions(suggestions.filter(s => s.id !== id));
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Mobile Preview Toggle */}
      <div className="md:hidden fixed bottom-4 right-4">
        <Button
          size="lg"
          onClick={() => setShowPreview(!showPreview)}
          className="rounded-full shadow-lg"
        >
          {showPreview ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </Button>
      </div>

      {/* Export Dialog */}
      <ExportDialog
        open={exportOpen}
        onOpenChange={setExportOpen}
        resume={store.resume}
      />

      {/* Import Dialog */}
      <Dialog open={importOpen} onOpenChange={setImportOpen}>
        <DialogContent className="max-w-2xl">
          <ImportResume
            onParsed={handleImportParsed}
            onClose={() => setImportOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
