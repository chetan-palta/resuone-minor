import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, ChevronDown, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SortableSectionProps {
  id: string;
  title: string;
  visible: boolean;
  expanded: boolean;
  onToggleExpand: () => void;
  onToggleVisibility: () => void;
  children: React.ReactNode;
}

export function SortableSection({
  id,
  title,
  visible,
  expanded,
  onToggleExpand,
  onToggleVisibility,
  children,
}: SortableSectionProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "bg-card rounded-xl border border-border overflow-hidden transition-shadow",
        isDragging && "shadow-lg opacity-90",
        !visible && "opacity-60"
      )}
    >
      <div className="flex items-center gap-2 p-4 border-b border-border bg-muted/30">
        <button
          className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground transition-colors"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="w-5 h-5" />
        </button>
        
        <button
          onClick={onToggleExpand}
          className="flex-1 flex items-center gap-2 text-left"
        >
          <span className="font-medium text-foreground">{title}</span>
          <ChevronDown
            className={cn(
              "w-4 h-4 text-muted-foreground transition-transform",
              expanded && "rotate-180"
            )}
          />
        </button>

        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleVisibility}
          className="h-8 w-8"
        >
          {visible ? (
            <Eye className="w-4 h-4" />
          ) : (
            <EyeOff className="w-4 h-4" />
          )}
        </Button>
      </div>

      {expanded && (
        <div className="p-4 animate-fade-in">
          {children}
        </div>
      )}
    </div>
  );
}
