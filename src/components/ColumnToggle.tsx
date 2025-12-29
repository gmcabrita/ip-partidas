import { Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { COLUMNS } from "@/types";
import type { ColumnVisibility, ColumnId } from "@/types";

interface ColumnToggleProps {
  visibility: ColumnVisibility;
  onChange: (visibility: ColumnVisibility) => void;
}

export function ColumnToggle({ visibility, onChange }: ColumnToggleProps) {
  const toggleColumn = (columnId: ColumnId) => {
    onChange({
      ...visibility,
      [columnId]: !visibility[columnId],
    });
  };

  const visibleCount = Object.values(visibility).filter(Boolean).length;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8">
          <Settings2 className="mr-2 h-4 w-4" />
          Colunas ({visibleCount}/{COLUMNS.length})
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-48">
        <div className="space-y-2">
          <p className="text-sm font-medium mb-3">Colunas visiveis</p>
          {COLUMNS.map((column) => (
            <label key={column.id} className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                id={column.id}
                checked={visibility[column.id]}
                onCheckedChange={() => toggleColumn(column.id)}
              />
              <span className="text-sm">{column.label}</span>
            </label>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
