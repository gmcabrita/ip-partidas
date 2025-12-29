import { Check, ChevronsUpDown, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

interface DestinationFilterProps {
  value: string[];
  onChange: (destinations: string[]) => void;
  availableDestinations: string[];
}

export function DestinationFilter({
  value,
  onChange,
  availableDestinations,
}: DestinationFilterProps) {
  const [open, setOpen] = useState(false);

  const toggleDestination = (destination: string) => {
    if (value.includes(destination)) {
      onChange(value.filter((v) => v !== destination));
    } else {
      onChange([...value, destination]);
    }
  };

  const selectAll = () => {
    onChange([...availableDestinations]);
  };

  const clearAll = () => {
    onChange([]);
  };

  const selectedCount = value.filter((v) =>
    availableDestinations.includes(v)
  ).length;
  const allSelected =
    availableDestinations.length > 0 &&
    selectedCount === availableDestinations.length;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between h-auto min-h-10 min-w-0"
          disabled={availableDestinations.length === 0}
        >
          <div className="flex flex-wrap gap-1 items-center min-w-0">
            {availableDestinations.length === 0 ? (
              <span className="text-muted-foreground">
                Sem destinos disponiveis
              </span>
            ) : selectedCount === 0 ? (
              <span className="text-muted-foreground">
                Selecionar destinos...
              </span>
            ) : allSelected ? (
              <span className="flex items-center gap-2">
                <MapPin className="h-4 w-4 shrink-0" />
                Todos os destinos
              </span>
            ) : (
              value
                .filter((v) => availableDestinations.includes(v))
                .map((destination) => (
                  <Badge
                    key={destination}
                    variant="secondary"
                    className="text-xs"
                  >
                    {destination}
                  </Badge>
                ))
            )}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Pesquisar destino..." />
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
            <CommandEmpty>Nenhum destino encontrado.</CommandEmpty>
            <CommandGroup heading="Destinos">
              {availableDestinations.map((destination) => (
                <CommandItem
                  key={destination}
                  value={destination}
                  onSelect={() => toggleDestination(destination)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value.includes(destination) ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <MapPin className="mr-2 h-4 w-4" />
                  <span>{destination}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
