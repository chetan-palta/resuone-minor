import { Education, GradeType } from "@/types/resume";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";

interface EducationFormProps {
  data: Education[];
  onAdd: (education: Education) => void;
  onUpdate: (id: string, updates: Partial<Education>) => void;
  onRemove: (id: string) => void;
}

export function EducationForm({ data, onAdd, onUpdate, onRemove }: EducationFormProps) {
  const handleAdd = () => {
    onAdd({
      id: crypto.randomUUID(),
      institution: "",
      degree: "",
      field: "",
      startDate: "",
      endDate: "",
      gradeType: undefined,
      gradeValue: "",
      description: "",
    });
  };

  const getGradePlaceholder = (gradeType?: GradeType) => {
    switch (gradeType) {
      case "percentage":
        return "e.g., 85%";
      case "cgpa10":
        return "e.g., 8.5/10";
      case "cgpa9.5":
        return "e.g., 8.5/9.5";
      default:
        return "Select grade type first";
    }
  };

  return (
    <div className="space-y-6">
      {data.map((edu) => (
        <div key={edu.id} className="space-y-4 p-4 bg-muted/30 rounded-lg relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onRemove(edu.id)}
            className="absolute top-2 right-2 h-8 w-8 text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="w-4 h-4" />
          </Button>

          <div className="space-y-2">
            <Label>Institution *</Label>
            <Input
              placeholder="Enter institution name"
              value={edu.institution}
              onChange={(e) => onUpdate(edu.id, { institution: e.target.value })}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Degree</Label>
              <Input
                placeholder="e.g., Bachelor of Science"
                value={edu.degree}
                onChange={(e) => onUpdate(edu.id, { degree: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Field of Study</Label>
              <Input
                placeholder="e.g., Computer Science"
                value={edu.field}
                onChange={(e) => onUpdate(edu.id, { field: e.target.value })}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Input
                placeholder="e.g., Sep 2019"
                value={edu.startDate}
                onChange={(e) => onUpdate(edu.id, { startDate: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>End Date</Label>
              <Input
                placeholder="e.g., May 2023"
                value={edu.endDate}
                onChange={(e) => onUpdate(edu.id, { endDate: e.target.value })}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Grade Type</Label>
              <Select
                value={edu.gradeType || ""}
                onValueChange={(value) => onUpdate(edu.id, { gradeType: value as GradeType })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select grade type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">Percentage (%)</SelectItem>
                  <SelectItem value="cgpa10">CGPA (out of 10)</SelectItem>
                  <SelectItem value="cgpa9.5">CGPA (out of 9.5)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Grade Value</Label>
              <Input
                placeholder={getGradePlaceholder(edu.gradeType)}
                value={edu.gradeValue || ""}
                onChange={(e) => onUpdate(edu.id, { gradeValue: e.target.value })}
                disabled={!edu.gradeType}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              placeholder="Relevant coursework, achievements, activities..."
              rows={2}
              value={edu.description || ""}
              onChange={(e) => onUpdate(edu.id, { description: e.target.value })}
            />
          </div>
        </div>
      ))}

      <Button variant="outline" onClick={handleAdd} className="w-full">
        <Plus className="w-4 h-4 mr-2" />
        Add Education
      </Button>
    </div>
  );
}
