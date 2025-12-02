import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ResumeData } from "@/types/resume";
import { FileText, FileType, FileJson, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { exportToPDF, exportToDOCX, exportToJSON } from "@/lib/exportUtils";

interface ExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  resume: ResumeData;
}

export function ExportDialog({ open, onOpenChange, resume }: ExportDialogProps) {
  const [exporting, setExporting] = useState<"pdf" | "docx" | null>(null);

  const handleExportPDF = async () => {
    setExporting("pdf");
    try {
      await exportToPDF(resume);
      toast({
        title: "PDF Exported",
        description: "Your resume has been downloaded as a PDF.",
      });
    } catch (error) {
      console.error("PDF export error:", error);
      toast({
        title: "Export Failed",
        description: "There was an error exporting your resume. Please try again.",
        variant: "destructive",
      });
    } finally {
      setExporting(null);
    }
  };

  const handleExportDOCX = async () => {
    setExporting("docx");
    try {
      await exportToDOCX(resume);
      toast({
        title: "DOCX Exported",
        description: "Your resume has been downloaded as a Word document.",
      });
    } catch (error) {
      console.error("DOCX export error:", error);
      toast({
        title: "Export Failed",
        description: "There was an error exporting your resume. Please try again.",
        variant: "destructive",
      });
    } finally {
      setExporting(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Export Resume</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <p className="text-sm text-muted-foreground">
            Choose your preferred format to download your resume.
          </p>

          <div className="grid gap-3">
            <Button
              variant="outline"
              className="h-auto py-4 justify-start"
              onClick={handleExportPDF}
              disabled={exporting !== null}
            >
              {exporting === "pdf" ? (
                <Loader2 className="w-8 h-8 mr-3 animate-spin text-primary" />
              ) : (
                <FileText className="w-8 h-8 mr-3 text-red-500" />
              )}
              <div className="text-left">
                <div className="font-semibold">PDF Document</div>
                <div className="text-xs text-muted-foreground">
                  Best for sharing and printing. Links are clickable.
                </div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="h-auto py-4 justify-start"
              onClick={handleExportDOCX}
              disabled={exporting !== null}
            >
              {exporting === "docx" ? (
                <Loader2 className="w-8 h-8 mr-3 animate-spin text-primary" />
              ) : (
                <FileType className="w-8 h-8 mr-3 text-blue-500" />
              )}
              <div className="text-left">
                <div className="font-semibold">Word Document (.docx)</div>
                <div className="text-xs text-muted-foreground">
                  Editable format. Works with Microsoft Word.
                </div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="h-auto py-4 justify-start"
              onClick={() => {
                exportToJSON(resume);
                toast({ title: "JSON Exported", description: "Backup file saved. Use Import to restore." });
              }}
              disabled={exporting !== null}
            >
              <FileJson className="w-8 h-8 mr-3 text-green-500" />
              <div className="text-left">
                <div className="font-semibold">JSON Backup</div>
                <div className="text-xs text-muted-foreground">
                  Save data for later import into ResuOne.
                </div>
              </div>
            </Button>
          </div>

          <p className="text-xs text-muted-foreground text-center pt-2">
            Tip: PDF format is recommended for job applications.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
