import { format } from "date-fns";
import { pt } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface DatePickerProps {
  value: Date;
  onChange: (date: Date) => void;
}

function formatDate(date: Date): string {
  const day = format(date, "EEEE", { locale: pt });
  const dayNum = format(date, "d", { locale: pt });
  const month = format(date, "MMMM", { locale: pt });
  const year = format(date, "yyyy", { locale: pt });

  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

  return `${capitalize(day)}, ${dayNum} de ${capitalize(month)} de ${year}`;
}

export function DatePicker({ value, onChange }: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal min-w-0",
            !value && "text-muted-foreground",
          )}
        >
          <CalendarIcon className="h-4 w-4 shrink-0" />
          <span className="truncate">{value ? formatDate(value) : "Selecionar data..."}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value}
          onSelect={(date) => date && onChange(date)}
          locale={pt}
        />
      </PopoverContent>
    </Popover>
  );
}
