import { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useResumeStore } from "@/hooks/useResumeStore";
import { SortableSection } from "./SortableSection";
import { PersonalInfoForm } from "./forms/PersonalInfoForm";
import { EducationForm } from "./forms/EducationForm";
import { ExperienceForm } from "./forms/ExperienceForm";
import { SkillsForm } from "./forms/SkillsForm";
import { ProjectsForm } from "./forms/ProjectsForm";
import { CertificationsForm } from "./forms/CertificationsForm";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface ResumeFormProps {
  store: ReturnType<typeof useResumeStore>;
}

export function ResumeForm({ store }: ResumeFormProps) {
  const { resume, reorderSections, toggleSectionVisibility, updateResume } = store;
  const [expandedSection, setExpandedSection] = useState<string | null>("personal");

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = resume.sections.findIndex((s) => s.id === active.id);
      const newIndex = resume.sections.findIndex((s) => s.id === over.id);
      const newSections = arrayMove(resume.sections, oldIndex, newIndex).map(
        (s, i) => ({ ...s, order: i })
      );
      reorderSections(newSections);
    }
  };

  const handleMetadataChange = (updates: Partial<{ isFresher: boolean; jobRole: string }>) => {
    updateResume({
      metadata: {
        ...resume.metadata,
        ...updates,
      },
    });
  };

  const getSectionForm = (sectionId: string) => {
    switch (sectionId) {
      case "personal":
        return (
          <PersonalInfoForm
            data={resume.personal}
            onChange={store.updatePersonal}
          />
        );
      case "education":
        return (
          <EducationForm
            data={resume.education}
            onAdd={store.addEducation}
            onUpdate={store.updateEducation}
            onRemove={store.removeEducation}
          />
        );
      case "experience":
        return (
          <ExperienceForm
            data={resume.experience}
            onAdd={store.addExperience}
            onUpdate={store.updateExperience}
            onRemove={store.removeExperience}
          />
        );
      case "skills":
        return (
          <SkillsForm
            data={resume.skills}
            onAdd={store.addSkill}
            onUpdate={store.updateSkill}
            onRemove={store.removeSkill}
          />
        );
      case "projects":
        return (
          <ProjectsForm
            data={resume.projects}
            onAdd={store.addProject}
            onUpdate={store.updateProject}
            onRemove={store.removeProject}
          />
        );
      case "certifications":
        return (
          <CertificationsForm
            data={resume.certifications}
            onAdd={store.addCertification}
            onUpdate={store.updateCertification}
            onRemove={store.removeCertification}
          />
        );
      default:
        return null;
    }
  };

  const getSectionTitle = (type: string) => {
    const titles: Record<string, string> = {
      personal: "Personal Information",
      education: "Education",
      experience: "Work Experience",
      skills: "Skills",
      projects: "Projects",
      certifications: "Certifications",
    };
    return titles[type] || type;
  };

  const sortedSections = [...resume.sections].sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-4">
      {/* Job Application Options */}
      <div className="p-4 bg-muted/30 rounded-lg space-y-4">
        <h3 className="font-semibold text-foreground">Application Details (Optional)</h3>
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="fresher">I am a Fresher</Label>
            <p className="text-xs text-muted-foreground">Check if you have no prior work experience</p>
          </div>
          <Switch
            id="fresher"
            checked={resume.metadata?.isFresher || false}
            onCheckedChange={(checked) => handleMetadataChange({ isFresher: checked })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="jobRole">Job Role Applied For</Label>
          <Input
            id="jobRole"
            placeholder="e.g., Software Developer, Data Analyst"
            value={resume.metadata?.jobRole || ""}
            onChange={(e) => handleMetadataChange({ jobRole: e.target.value })}
          />
        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={sortedSections.map((s) => s.id)}
          strategy={verticalListSortingStrategy}
        >
          {sortedSections.map((section) => (
            <SortableSection
              key={section.id}
              id={section.id}
              title={getSectionTitle(section.type)}
              visible={section.visible}
              expanded={expandedSection === section.id}
              onToggleExpand={() =>
                setExpandedSection(
                  expandedSection === section.id ? null : section.id
                )
              }
              onToggleVisibility={() => toggleSectionVisibility(section.id)}
            >
              {getSectionForm(section.id)}
            </SortableSection>
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
}
