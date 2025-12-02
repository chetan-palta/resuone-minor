import { ResumeData, FONT_OPTIONS } from "@/types/resume";
import { cn } from "@/lib/utils";
import { MinimalTemplate } from "./templates/MinimalTemplate";
import { ProfessionalTemplate } from "./templates/ProfessionalTemplate";
import { ModernTemplate } from "./templates/ModernTemplate";
import { ATSTemplate } from "./templates/ATSTemplate";
import { TwoColumnTemplate } from "./templates/TwoColumnTemplate";

interface ResumePreviewProps {
  resume: ResumeData;
}

export function ResumePreview({ resume }: ResumePreviewProps) {
  const fontClass = FONT_OPTIONS.find(f => f.id === resume.fontFamily)?.className || "font-resume-inter";

  const getTemplate = () => {
    switch (resume.templateId) {
      case "minimal":
        return <MinimalTemplate resume={resume} />;
      case "professional":
        return <ProfessionalTemplate resume={resume} />;
      case "modern":
        return <ModernTemplate resume={resume} />;
      case "ats":
        return <ATSTemplate resume={resume} />;
      case "two-column":
        return <TwoColumnTemplate resume={resume} />;
      default:
        return <ProfessionalTemplate resume={resume} />;
    }
  };

  return (
    <div
      id="resume-preview"
      className={cn(
        "resume-paper bg-white text-gray-900 w-full aspect-[8.5/11] p-8 overflow-hidden",
        fontClass
      )}
      style={{ 
        "--accent-color": resume.accentColor,
        fontSize: "10pt",
        lineHeight: "1.4",
      } as React.CSSProperties}
    >
      {getTemplate()}
    </div>
  );
}
