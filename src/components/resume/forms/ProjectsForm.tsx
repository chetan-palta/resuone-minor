import { Project } from "@/types/resume";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, X } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

interface ProjectsFormProps {
  data: Project[];
  onAdd: (project: Project) => void;
  onUpdate: (id: string, updates: Partial<Project>) => void;
  onRemove: (id: string) => void;
}

export function ProjectsForm({ data, onAdd, onUpdate, onRemove }: ProjectsFormProps) {
  const [newTechInputs, setNewTechInputs] = useState<Record<string, string>>({});

  const handleAdd = () => {
    onAdd({
      id: crypto.randomUUID(),
      name: "",
      description: "",
      technologies: [],
      link: "",
      github: "",
    });
  };

  const handleAddTech = (projectId: string) => {
    const input = newTechInputs[projectId]?.trim();
    if (!input) return;
    
    const project = data.find(p => p.id === projectId);
    if (project) {
      onUpdate(projectId, { technologies: [...project.technologies, input] });
      setNewTechInputs(prev => ({ ...prev, [projectId]: "" }));
    }
  };

  const handleRemoveTech = (projectId: string, techIndex: number) => {
    const project = data.find(p => p.id === projectId);
    if (project) {
      onUpdate(projectId, { 
        technologies: project.technologies.filter((_, i) => i !== techIndex) 
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, projectId: string) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTech(projectId);
    }
  };

  return (
    <div className="space-y-6">
      {data.map((project) => (
        <div key={project.id} className="space-y-4 p-4 bg-muted/30 rounded-lg relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onRemove(project.id)}
            className="absolute top-2 right-2 h-8 w-8 text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="w-4 h-4" />
          </Button>

          <div className="space-y-2">
            <Label>Project Name *</Label>
            <Input
              placeholder="My Awesome Project"
              value={project.name}
              onChange={(e) => onUpdate(project.id, { name: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              placeholder="What does the project do? What problem does it solve?"
              rows={3}
              value={project.description}
              onChange={(e) => onUpdate(project.id, { description: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>Technologies</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {project.technologies.map((tech, index) => (
                <Badge key={index} variant="secondary" className="gap-1">
                  {tech}
                  <button
                    onClick={() => handleRemoveTech(project.id, index)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Add technology and press Enter"
                value={newTechInputs[project.id] || ""}
                onChange={(e) => 
                  setNewTechInputs(prev => ({ ...prev, [project.id]: e.target.value }))
                }
                onKeyDown={(e) => handleKeyDown(e, project.id)}
              />
              <Button 
                type="button" 
                variant="secondary" 
                size="icon"
                onClick={() => handleAddTech(project.id)}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Live Link</Label>
              <Input
                placeholder="https://myproject.com"
                value={project.link || ""}
                onChange={(e) => onUpdate(project.id, { link: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>GitHub</Label>
              <Input
                placeholder="github.com/user/project"
                value={project.github || ""}
                onChange={(e) => onUpdate(project.id, { github: e.target.value })}
              />
            </div>
          </div>
        </div>
      ))}

      <Button variant="outline" onClick={handleAdd} className="w-full">
        <Plus className="w-4 h-4 mr-2" />
        Add Project
      </Button>
    </div>
  );
}
