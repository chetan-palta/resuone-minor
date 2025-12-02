import { ResumeData, TEMPLATE_OPTIONS, FONT_OPTIONS, TemplateId } from "@/types/resume";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface TemplateSelectorProps {
  resume: ResumeData;
  onUpdate: (updates: Partial<ResumeData>) => void;
}

export function TemplateSelector({ resume, onUpdate }: TemplateSelectorProps) {
  return (
    <div className="flex flex-wrap gap-6 items-end">
      <div className="space-y-2 min-w-[200px]">
        <Label>Template</Label>
        <Select
          value={resume.templateId}
          onValueChange={(value: TemplateId) => onUpdate({ templateId: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select template" />
          </SelectTrigger>
          <SelectContent>
            {TEMPLATE_OPTIONS.map((template) => (
              <SelectItem key={template.id} value={template.id}>
                <div>
                  <span className="font-medium">{template.name}</span>
                  <span className="text-muted-foreground ml-2 text-xs">
                    — {template.description}
                  </span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2 min-w-[180px]">
        <Label>Font</Label>
        <Select
          value={resume.fontFamily}
          onValueChange={(value) => onUpdate({ fontFamily: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select font" />
          </SelectTrigger>
          <SelectContent>
            {FONT_OPTIONS.map((font) => (
              <SelectItem key={font.id} value={font.id}>
                {font.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Accent Color</Label>
        <div className="flex items-center gap-2">
          <Input
            type="color"
            value={resume.accentColor}
            onChange={(e) => onUpdate({ accentColor: e.target.value })}
            className="w-12 h-10 p-1 cursor-pointer"
          />
          <Input
            type="text"
            value={resume.accentColor}
            onChange={(e) => onUpdate({ accentColor: e.target.value })}
            className="w-24"
            placeholder="#2563eb"
          />
        </div>
      </div>
    </div>
  );
}
