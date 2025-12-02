import { useRef } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { ResumeData } from "@/types/resume";

interface ResumeImportProps {
  onImport: (data: ResumeData) => void;
}

export function ResumeImport({ onImport }: ResumeImportProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith(".json")) {
      toast({
        title: "Invalid file type",
        description: "Please upload a JSON file exported from ResuOne",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        
        // Validate basic structure
        if (!data.personalInfo || !data.sections) {
          throw new Error("Invalid resume format");
        }

        onImport(data as ResumeData);
        toast({ title: "Resume imported successfully!" });
      } catch (error) {
        toast({
          title: "Import failed",
          description: "Invalid resume file format",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileChange}
        className="hidden"
      />
      <Button
        variant="outline"
        size="sm"
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload className="w-4 h-4 mr-1" />
        Import
      </Button>
    </>
  );
}
