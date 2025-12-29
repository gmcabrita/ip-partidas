import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { StationSearch } from "@/components/StationSearch";
import { ServiceTypeSelect } from "@/components/ServiceTypeSelect";
import { DestinationFilter } from "@/components/DestinationFilter";
import { DatePicker } from "@/components/DatePicker";
import { TimetableView } from "@/components/TimetableView";
import { TrainInfoModal } from "@/components/TrainInfoModal";
import { ColumnToggle } from "@/components/ColumnToggle";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { getTimetable } from "@/lib/api";
import {
  saveStation,
  loadStation,
  saveServiceTypes,
  loadServiceTypes,
  saveColumnVisibility,
  loadColumnVisibility,
  saveDestinations,
  loadDestinations,
} from "@/lib/storage";
import { SERVICE_TYPES, DEFAULT_COLUMN_VISIBILITY } from "@/types";
import type { Station, Departure, ColumnVisibility } from "@/types";
import { Train, RefreshCw } from "lucide-react";

function App() {
  const [station, setStation] = useState<Station | null>(() => loadStation());
  const [serviceTypes, setServiceTypes] = useState<string[]>(
    () => loadServiceTypes() ?? SERVICE_TYPES.map((s) => s.value),
  );
  const [date, setDate] = useState<Date>(new Date());
  const [departures, setDepartures] = useState<Departure[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibility>(
    () => loadColumnVisibility() ?? DEFAULT_COLUMN_VISIBILITY,
  );
  const [selectedDestinations, setSelectedDestinations] = useState<string[]>(
    () => loadDestinations() ?? [],
  );
  const [selectedTrainId, setSelectedTrainId] = useState<number | null>(null);

  const isInitialMount = useRef(true);

  const canSearch = station !== null && serviceTypes.length > 0;

  const fetchTimetable = useCallback(async () => {
    if (!station || serviceTypes.length === 0) {
      return;
    }

    setIsLoading(true);
    setHasSearched(true);

    try {
      const result = await getTimetable(station.NodeID, date, serviceTypes);
      const allDepartures = result.response?.[0]?.NodesComboioTabelsPartidasChegadas || [];
      setDepartures(allDepartures);
    } catch (error) {
      console.error("Failed to fetch timetable:", error);
      setDepartures([]);
    } finally {
      setIsLoading(false);
    }
  }, [station, serviceTypes, date]);

  // Auto-search when filters change
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      // If we have saved preferences, search immediately on mount
      if (canSearch) {
        fetchTimetable();
      }
      return;
    }

    if (canSearch) {
      fetchTimetable();
    }
  }, [station, serviceTypes, date, canSearch, fetchTimetable]);

  // Persist station to localStorage and clear destination filter
  const handleStationChange = useCallback((newStation: Station | null) => {
    setStation(newStation);
    saveStation(newStation);
    setSelectedDestinations([]);
    saveDestinations([]);
  }, []);

  // Persist service types to localStorage
  const handleServiceTypesChange = useCallback((newTypes: string[]) => {
    setServiceTypes(newTypes);
    saveServiceTypes(newTypes);
  }, []);

  // Persist column visibility to localStorage
  const handleColumnVisibilityChange = useCallback((newVisibility: ColumnVisibility) => {
    setColumnVisibility(newVisibility);
    saveColumnVisibility(newVisibility);
  }, []);

  // Persist selected destinations to localStorage
  const handleDestinationsChange = useCallback((newDestinations: string[]) => {
    setSelectedDestinations(newDestinations);
    saveDestinations(newDestinations);
  }, []);

  // Extract unique destinations from departures
  const availableDestinations = useMemo(() => {
    const destinations = new Set(departures.map((d) => d.NomeEstacaoDestino));
    return Array.from(destinations).sort();
  }, [departures]);

  // Filter departures by selected destinations (client-side)
  const filteredDepartures = useMemo(() => {
    if (selectedDestinations.length === 0) {
      return departures;
    }
    return departures.filter((d) => selectedDestinations.includes(d.NomeEstacaoDestino));
  }, [departures, selectedDestinations]);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <Train className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold">Horários de Comboios</h1>
              <p className="text-sm text-muted-foreground">
                Consulte os horários de partidas em tempo real
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg">Pesquisar Horários</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="station">Estação</Label>
                <StationSearch value={station} onChange={handleStationChange} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="services">Tipos de Serviço</Label>
                <ServiceTypeSelect value={serviceTypes} onChange={handleServiceTypesChange} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Data</Label>
                <DatePicker value={date} onChange={setDate} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="destinations">Destinos</Label>
                <DestinationFilter
                  value={selectedDestinations}
                  onChange={handleDestinationsChange}
                  availableDestinations={availableDestinations}
                />
              </div>
            </div>

            {!canSearch && (
              <p className="mt-4 text-sm text-muted-foreground">
                Selecione uma estação e pelo menos um tipo de serviço para ver os horários.
              </p>
            )}
          </CardContent>
        </Card>

        {hasSearched && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>
                  Partidas de <span className="text-primary">{station?.Nome}</span>
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8"
                    onClick={fetchTimetable}
                    disabled={isLoading}
                  >
                    <RefreshCw className={`h-4 w-4`} />
                  </Button>
                  <ColumnToggle
                    visibility={columnVisibility}
                    onChange={handleColumnVisibilityChange}
                  />
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <TimetableView
                departures={filteredDepartures}
                isLoading={isLoading}
                columnVisibility={columnVisibility}
                onTrainClick={setSelectedTrainId}
              />
            </CardContent>
          </Card>
        )}

        <TrainInfoModal
          trainId={selectedTrainId}
          date={date}
          onClose={() => setSelectedTrainId(null)}
        />
      </main>

      <footer className="border-t bg-card mt-auto">
        <div className="container mx-auto px-4 py-4">
          <p className="text-center text-sm text-muted-foreground">
            Dados fornecidos por{" "}
            <a
              href="https://www.infraestruturasdeportugal.pt"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Infraestruturas de Portugal
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
