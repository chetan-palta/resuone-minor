import { useState } from 'react';
import { AlertCircle, CheckCircle2, XCircle, Lightbulb, TrendingUp, Download } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';

interface Suggestion {
  id: string;
  priority: 'high' | 'medium' | 'low';
  title: string;
  detail: string;
  autoApply?: boolean;
  patch?: any;
}

interface SuggestionsPanelProps {
  suggestions: Suggestion[];
  atsScore: number;
  onApply?: (suggestionId: string) => void;
  onIgnore?: (suggestionId: string) => void;
}

export function SuggestionsPanel({ suggestions, atsScore, onApply, onIgnore }: SuggestionsPanelProps) {
  const [applied, setApplied] = useState<Set<string>>(new Set());
  const [ignored, setIgnored] = useState<Set<string>>(new Set());

  const handleApply = (suggestion: Suggestion) => {
    setApplied(new Set([...applied, suggestion.id]));
    onApply?.(suggestion.id);
  };

  const handleIgnore = (suggestionId: string) => {
    setIgnored(new Set([...ignored, suggestionId]));
    onIgnore?.(suggestionId);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'default';
      case 'low':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return <AlertCircle className="w-4 h-4" />;
      case 'medium':
        return <Lightbulb className="w-4 h-4" />;
      case 'low':
        return <CheckCircle2 className="w-4 h-4" />;
      default:
        return <Lightbulb className="w-4 h-4" />;
    }
  };

  const visibleSuggestions = suggestions.filter(s => !ignored.has(s.id));

  const exportReport = () => {
    const report = {
      atsScore,
      suggestions: visibleSuggestions.map(s => ({
        priority: s.priority,
        title: s.title,
        detail: s.detail,
        applied: applied.has(s.id)
      })),
      generatedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `resume-suggestions-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="p-4 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Resume Analysis
        </h3>
        <Button variant="ghost" size="sm" onClick={exportReport}>
          <Download className="w-4 h-4" />
        </Button>
      </div>

      {/* ATS Score */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">ATS Score</span>
          <span className="text-2xl font-bold">{atsScore}/100</span>
        </div>
        <Progress value={atsScore} className="h-2" />
        <p className="text-xs text-muted-foreground mt-2">
          {atsScore >= 80 ? 'Excellent' : atsScore >= 60 ? 'Good' : atsScore >= 40 ? 'Fair' : 'Needs Improvement'}
        </p>
      </div>

      <Separator className="mb-4" />

      {/* Suggestions List */}
      <ScrollArea className="flex-1">
        <div className="space-y-3">
          {visibleSuggestions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <CheckCircle2 className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No suggestions. Your resume looks great!</p>
            </div>
          ) : (
            visibleSuggestions.map((suggestion) => {
              const isApplied = applied.has(suggestion.id);
              
              return (
                <Card key={suggestion.id} className="p-3">
                  <div className="flex items-start gap-3">
                    <div className={`mt-0.5 ${isApplied ? 'text-green-600' : 'text-muted-foreground'}`}>
                      {getPriorityIcon(suggestion.priority)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant={getPriorityColor(suggestion.priority)} className="text-xs">
                          {suggestion.priority}
                        </Badge>
                        <h4 className="text-sm font-medium">{suggestion.title}</h4>
                        {isApplied && (
                          <Badge variant="outline" className="text-xs">
                            Applied
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">
                        {suggestion.detail}
                      </p>
                      {!isApplied && (
                        <div className="flex gap-2">
                          {suggestion.autoApply && (
                            <Button
                              size="sm"
                              variant="default"
                              className="h-7 text-xs"
                              onClick={() => handleApply(suggestion)}
                            >
                              Apply
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 text-xs"
                            onClick={() => handleIgnore(suggestion.id)}
                          >
                            <XCircle className="w-3 h-3 mr-1" />
                            Ignore
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })
          )}
        </div>
      </ScrollArea>
    </Card>
  );
}

