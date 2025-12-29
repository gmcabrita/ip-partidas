import { Check, ChevronsUpDown, TrainFront } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { SERVICE_TYPES } from "@/types";
import { useState } from "react";

interface ServiceTypeSelectProps {
  value: string[];
  onChange: (services: string[]) => void;
}

export function ServiceTypeSelect({ value, onChange }: ServiceTypeSelectProps) {
  const [open, setOpen] = useState(false);

  const toggleService = (serviceValue: string) => {
    if (value.includes(serviceValue)) {
      onChange(value.filter((v) => v !== serviceValue));
    } else {
      onChange([...value, serviceValue]);
    }
  };

  const selectAll = () => {
    onChange(SERVICE_TYPES.map((s) => s.value));
  };

  const clearAll = () => {
    onChange([]);
  };

  const selectedLabels = SERVICE_TYPES.filter((s) =>
    value.includes(s.value)
  ).map((s) => s.label);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between h-auto min-h-10 min-w-0"
        >
          <div className="flex flex-wrap gap-1 items-center min-w-0">
            {value.length === 0 ? (
              <span className="text-muted-foreground">
                Selecionar tipos de serviço...
              </span>
            ) : value.length === SERVICE_TYPES.length ? (
              <span className="flex items-center gap-2">
                <TrainFront className="h-4 w-4 shrink-0" />
                Todos os serviços
              </span>
            ) : (
              selectedLabels.map((label) => (
                <Badge key={label} variant="secondary" className="text-xs">
                  {label}
                </Badge>
              ))
            )}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0" align="start">
        <Command>
          <div className="flex gap-2 p-2 border-b">
            <Button
              variant="outline"
              size="sm"
              onClick={selectAll}
              className="flex-1"
            >
              Selecionar todos
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={clearAll}
              className="flex-1"
            >
              Limpar
            </Button>
          </div>
          <CommandList>
            <CommandEmpty>Nenhum serviço encontrado.</CommandEmpty>
            <CommandGroup heading="Tipos de Serviço">
              {SERVICE_TYPES.map((service) => (
                <CommandItem
                  key={service.value}
                  value={service.value}
                  onSelect={() => toggleService(service.value)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value.includes(service.value)
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  <TrainFront className="mr-2 h-4 w-4" />
                  <div className="flex flex-col">
                    <span>{service.label}</span>
                    <span className="text-xs text-muted-foreground">
                      {service.group}
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
