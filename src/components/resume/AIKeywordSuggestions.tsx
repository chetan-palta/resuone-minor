import { useState } from "react";
import { Sparkles, Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

// Fallback keyword suggestions when AI service is unavailable
function getFallbackKeywords(context: string): string[] {
  const lower = context.toLowerCase();
  const keywords: string[] = [];
  
  // Software Engineering
  if (lower.includes('software') || lower.includes('developer') || lower.includes('engineer')) {
    keywords.push('JavaScript', 'Python', 'React', 'Node.js', 'Git', 'REST APIs', 'Agile', 'TypeScript');
  }
  // Data Science
  if (lower.includes('data') || lower.includes('analyst') || lower.includes('scientist')) {
    keywords.push('Python', 'SQL', 'Machine Learning', 'Data Analysis', 'Pandas', 'NumPy', 'Tableau', 'Statistics');
  }
  // Web Development
  if (lower.includes('web') || lower.includes('frontend') || lower.includes('backend')) {
    keywords.push('HTML', 'CSS', 'JavaScript', 'React', 'Node.js', 'Responsive Design', 'REST APIs', 'Git');
  }
  // Mobile Development
  if (lower.includes('mobile') || lower.includes('ios') || lower.includes('android')) {
    keywords.push('React Native', 'Swift', 'Kotlin', 'Mobile UI/UX', 'App Development', 'iOS', 'Android', 'Flutter');
  }
  // DevOps
  if (lower.includes('devops') || lower.includes('cloud') || lower.includes('infrastructure')) {
    keywords.push('AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Linux', 'Terraform', 'Jenkins', 'Git');
  }
  // General tech
  keywords.push('Problem Solving', 'Team Collaboration', 'Communication', 'Project Management');
  
  return keywords.length > 0 ? keywords : ['Problem Solving', 'Team Collaboration', 'Communication', 'Leadership', 'Project Management', 'Analytical Skills', 'Time Management', 'Adaptability'];
}

interface AIKeywordSuggestionsProps {
  onAddKeyword: (keyword: string) => void;
  existingSkills?: string[];
}

export function AIKeywordSuggestions({ onAddKeyword, existingSkills = [] }: AIKeywordSuggestionsProps) {
  const [context, setContext] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchSuggestions = async () => {
    if (!context.trim()) {
      toast({ title: "Enter a job role or context", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("ai-suggestions", {
        body: { type: "keywords", context: context.trim() },
      });

      if (error) {
        // Edge function might not be deployed or configured
        console.warn("AI suggestions edge function error:", error);
        // Provide fallback suggestions based on common keywords
        const fallbackKeywords = getFallbackKeywords(context.trim());
        setSuggestions(fallbackKeywords.filter(
          (k) => !existingSkills.some((s) => s.toLowerCase() === k.toLowerCase())
        ).slice(0, 8));
        toast({
          title: "Using fallback suggestions",
          description: "AI service unavailable. Showing common keywords for this role.",
          variant: "default",
        });
        return;
      }

      let keywords: string[] = [];
      try {
        const parsed = JSON.parse(data.result);
        keywords = Array.isArray(parsed) ? parsed : [];
      } catch {
        // If not valid JSON, try to extract keywords from text
        keywords = data.result.split(/[,\n]/).map((k: string) => k.trim()).filter(Boolean);
      }

      // Filter out already existing skills
      const newKeywords = keywords.filter(
        (k) => !existingSkills.some((s) => s.toLowerCase() === k.toLowerCase())
      );
      setSuggestions(newKeywords.slice(0, 8));
    } catch (error: any) {
      console.error("AI suggestions error:", error);
      // Provide fallback on any error
      const fallbackKeywords = getFallbackKeywords(context.trim());
      setSuggestions(fallbackKeywords.filter(
        (k) => !existingSkills.some((s) => s.toLowerCase() === k.toLowerCase())
      ).slice(0, 8));
      toast({
        title: "Using fallback suggestions",
        description: "AI service unavailable. Showing common keywords for this role.",
        variant: "default",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddKeyword = (keyword: string) => {
    onAddKeyword(keyword);
    setSuggestions((prev) => prev.filter((k) => k !== keyword));
    toast({ title: `Added "${keyword}"` });
  };

  return (
    <div className="space-y-3 p-4 bg-muted/50 rounded-lg border border-border">
      <div className="flex items-center gap-2 text-sm font-medium text-foreground">
        <Sparkles className="w-4 h-4 text-primary" />
        AI Keyword Suggestions
      </div>
      
      <div className="flex gap-2">
        <Input
          placeholder="Enter job role (e.g., Software Engineer)"
          value={context}
          onChange={(e) => setContext(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && fetchSuggestions()}
          className="flex-1"
        />
        <Button onClick={fetchSuggestions} disabled={isLoading} size="sm">
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Suggest"}
        </Button>
      </div>

      {suggestions.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {suggestions.map((keyword) => (
            <Badge
              key={keyword}
              variant="secondary"
              className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
              onClick={() => handleAddKeyword(keyword)}
            >
              <Plus className="w-3 h-3 mr-1" />
              {keyword}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
