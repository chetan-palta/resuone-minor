import { Certification } from "@/types/resume";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

interface CertificationsFormProps {
  data: Certification[];
  onAdd: (certification: Certification) => void;
  onUpdate: (id: string, updates: Partial<Certification>) => void;
  onRemove: (id: string) => void;
}

export function CertificationsForm({ data, onAdd, onUpdate, onRemove }: CertificationsFormProps) {
  const handleAdd = () => {
    onAdd({
      id: crypto.randomUUID(),
      name: "",
      issuer: "",
      date: "",
      expiryDate: "",
      credentialId: "",
      link: "",
    });
  };

  return (
    <div className="space-y-6">
      {data.map((cert) => (
        <div key={cert.id} className="space-y-4 p-4 bg-muted/30 rounded-lg relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onRemove(cert.id)}
            className="absolute top-2 right-2 h-8 w-8 text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="w-4 h-4" />
          </Button>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Certification Name *</Label>
              <Input
                placeholder="AWS Solutions Architect"
                value={cert.name}
                onChange={(e) => onUpdate(cert.id, { name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Issuing Organization</Label>
              <Input
                placeholder="Amazon Web Services"
                value={cert.issuer}
                onChange={(e) => onUpdate(cert.id, { issuer: e.target.value })}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Issue Date</Label>
              <Input
                placeholder="Jan 2024"
                value={cert.date}
                onChange={(e) => onUpdate(cert.id, { date: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Expiry Date</Label>
              <Input
                placeholder="Jan 2027 (optional)"
                value={cert.expiryDate || ""}
                onChange={(e) => onUpdate(cert.id, { expiryDate: e.target.value })}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Credential ID</Label>
              <Input
                placeholder="ABC123XYZ"
                value={cert.credentialId || ""}
                onChange={(e) => onUpdate(cert.id, { credentialId: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Credential URL</Label>
              <Input
                placeholder="https://credly.com/..."
                value={cert.link || ""}
                onChange={(e) => onUpdate(cert.id, { link: e.target.value })}
              />
            </div>
          </div>
        </div>
      ))}

      <Button variant="outline" onClick={handleAdd} className="w-full">
        <Plus className="w-4 h-4 mr-2" />
        Add Certification
      </Button>
    </div>
  );
}
