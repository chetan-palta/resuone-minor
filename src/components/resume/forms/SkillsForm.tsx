import { Skill } from "@/types/resume";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, X } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { AIKeywordSuggestions } from "@/components/resume/AIKeywordSuggestions";

interface SkillsFormProps {
  data: Skill[];
  onAdd: (skill: Skill) => void;
  onUpdate: (id: string, updates: Partial<Skill>) => void;
  onRemove: (id: string) => void;
}

export function SkillsForm({ data, onAdd, onUpdate, onRemove }: SkillsFormProps) {
  const [newSkillInputs, setNewSkillInputs] = useState<Record<string, string>>({});

  const handleAdd = () => {
    onAdd({
      id: crypto.randomUUID(),
      category: "",
      skills: [],
    });
  };

  const handleAddSkill = (categoryId: string) => {
    const input = newSkillInputs[categoryId]?.trim();
    if (!input) return;
    
    const category = data.find(c => c.id === categoryId);
    if (category) {
      onUpdate(categoryId, { skills: [...category.skills, input] });
      setNewSkillInputs(prev => ({ ...prev, [categoryId]: "" }));
    }
  };

  const handleRemoveSkill = (categoryId: string, skillIndex: number) => {
    const category = data.find(c => c.id === categoryId);
    if (category) {
      onUpdate(categoryId, { 
        skills: category.skills.filter((_, i) => i !== skillIndex) 
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, categoryId: string) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddSkill(categoryId);
    }
  };

  return (
    <div className="space-y-6">
      {data.map((category) => (
        <div key={category.id} className="space-y-4 p-4 bg-muted/30 rounded-lg relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onRemove(category.id)}
            className="absolute top-2 right-2 h-8 w-8 text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="w-4 h-4" />
          </Button>

          <div className="space-y-2">
            <Label>Category Name</Label>
            <Input
              placeholder="Programming Languages, Frameworks, Tools..."
              value={category.category}
              onChange={(e) => onUpdate(category.id, { category: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>Skills</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {category.skills.map((skill, index) => (
                <Badge key={index} variant="secondary" className="gap-1">
                  {skill}
                  <button
                    onClick={() => handleRemoveSkill(category.id, index)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Add a skill and press Enter"
                value={newSkillInputs[category.id] || ""}
                onChange={(e) => 
                  setNewSkillInputs(prev => ({ ...prev, [category.id]: e.target.value }))
                }
                onKeyDown={(e) => handleKeyDown(e, category.id)}
              />
              <Button 
                type="button" 
                variant="secondary" 
                size="icon"
                onClick={() => handleAddSkill(category.id)}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      ))}

      <Button variant="outline" onClick={handleAdd} className="w-full">
        <Plus className="w-4 h-4 mr-2" />
        Add Skill Category
      </Button>

      <AIKeywordSuggestions
        existingSkills={data.flatMap((c) => c.skills)}
        onAddKeyword={(keyword) => {
          // Add to the first category or create one
          if (data.length > 0) {
            const firstCategory = data[0];
            onUpdate(firstCategory.id, { skills: [...firstCategory.skills, keyword] });
          } else {
            onAdd({
              id: crypto.randomUUID(),
              category: "Skills",
              skills: [keyword],
            });
          }
        }}
      />
    </div>
  );
}
