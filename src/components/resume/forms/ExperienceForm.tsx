import { Experience } from "@/types/resume";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash2 } from "lucide-react";

interface ExperienceFormProps {
  data: Experience[];
  onAdd: (experience: Experience) => void;
  onUpdate: (id: string, updates: Partial<Experience>) => void;
  onRemove: (id: string) => void;
}

export function ExperienceForm({ data, onAdd, onUpdate, onRemove }: ExperienceFormProps) {
  const handleAdd = () => {
    onAdd({
      id: crypto.randomUUID(),
      company: "",
      position: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
      achievements: [],
    });
  };

  const handleAchievementChange = (id: string, value: string) => {
    const achievements = value.split("\n").filter(Boolean);
    onUpdate(id, { achievements });
  };

  return (
    <div className="space-y-6">
      {data.map((exp) => (
        <div key={exp.id} className="space-y-4 p-4 bg-muted/30 rounded-lg relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onRemove(exp.id)}
            className="absolute top-2 right-2 h-8 w-8 text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="w-4 h-4" />
          </Button>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Company *</Label>
              <Input
                placeholder="Company Name"
                value={exp.company}
                onChange={(e) => onUpdate(exp.id, { company: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Position *</Label>
              <Input
                placeholder="Software Engineer"
                value={exp.position}
                onChange={(e) => onUpdate(exp.id, { position: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Location</Label>
            <Input
              placeholder="San Francisco, CA"
              value={exp.location}
              onChange={(e) => onUpdate(exp.id, { location: e.target.value })}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Input
                placeholder="Jan 2022"
                value={exp.startDate}
                onChange={(e) => onUpdate(exp.id, { startDate: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>End Date</Label>
              <Input
                placeholder="Present"
                value={exp.endDate}
                onChange={(e) => onUpdate(exp.id, { endDate: e.target.value })}
                disabled={exp.current}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id={`current-${exp.id}`}
              checked={exp.current}
              onCheckedChange={(checked) =>
                onUpdate(exp.id, { current: !!checked, endDate: checked ? "Present" : "" })
              }
            />
            <Label htmlFor={`current-${exp.id}`} className="text-sm font-normal">
              I currently work here
            </Label>
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              placeholder="Brief description of your role..."
              rows={2}
              value={exp.description}
              onChange={(e) => onUpdate(exp.id, { description: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>Key Achievements (one per line)</Label>
            <Textarea
              placeholder="• Led a team of 5 engineers to deliver the project on time&#10;• Increased system performance by 40%&#10;• Implemented CI/CD pipeline reducing deployment time by 60%"
              rows={4}
              value={exp.achievements.join("\n")}
              onChange={(e) => handleAchievementChange(exp.id, e.target.value)}
            />
          </div>
        </div>
      ))}

      <Button variant="outline" onClick={handleAdd} className="w-full">
        <Plus className="w-4 h-4 mr-2" />
        Add Experience
      </Button>
    </div>
  );
}
