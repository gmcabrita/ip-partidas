import { useState, useEffect, useCallback } from "react";
import { Check, ChevronsUpDown, Loader2, Train } from "lucide-react";
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
import { searchStations } from "@/lib/api";
import type { Station } from "@/types";

interface StationSearchProps {
  value: Station | null;
  onChange: (station: Station | null) => void;
}

export function StationSearch({ value, onChange }: StationSearchProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(false);

  const debouncedSearch = useCallback((searchQuery: string) => {
    const timeoutId = setTimeout(async () => {
      if (searchQuery.length < 2) {
        setStations([]);
        return;
      }

      setLoading(true);
      try {
        const result = await searchStations(searchQuery);
        setStations(result.response || []);
      } catch (error) {
        console.error("Failed to search stations:", error);
        setStations([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return timeoutId;
  }, []);

  useEffect(() => {
    const timeoutId = debouncedSearch(query);
    return () => clearTimeout(timeoutId);
  }, [query, debouncedSearch]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value ? (
            <span className="flex items-center gap-2">
              <Train className="h-4 w-4" />
              {value.Nome}
            </span>
          ) : (
            "Selecionar estação..."
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Procurar estação..."
            value={query}
            onValueChange={setQuery}
          />
          <CommandList>
            {loading && (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="ml-2 text-sm text-muted-foreground">
                  A procurar...
                </span>
              </div>
            )}
            {!loading && query.length >= 2 && stations.length === 0 && (
              <CommandEmpty>Nenhuma estação encontrada.</CommandEmpty>
            )}
            {!loading && query.length < 2 && (
              <div className="py-6 text-center text-sm text-muted-foreground">
                Digite pelo menos 2 caracteres para pesquisar.
              </div>
            )}
            {!loading && stations.length > 0 && (
              <CommandGroup heading="Estacoes">
                {stations.map((station) => (
                  <CommandItem
                    key={station.NodeID}
                    value={station.Nome}
                    onSelect={() => {
                      onChange(station);
                      setOpen(false);
                      setQuery("");
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value?.NodeID === station.NodeID
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    <Train className="mr-2 h-4 w-4" />
                    {station.Nome}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
