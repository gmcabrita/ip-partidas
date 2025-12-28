import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getTrainInformation } from "@/lib/api";
import type { TrainInformation } from "@/types";
import { AlertTriangle, CheckCircle2, ChevronDown, ChevronUp, Clock, Train } from "lucide-react";

interface TrainInfoModalProps {
  trainId: number | null;
  date: Date;
  onClose: () => void;
}

export function TrainInfoModal({ trainId, date, onClose }: TrainInfoModalProps) {
  const [trainInfo, setTrainInfo] = useState<TrainInformation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPassedStops, setShowPassedStops] = useState(false);

  useEffect(() => {
    if (trainId === null) {
      setTrainInfo(null);
      setIsLoading(false);
      return;
    }

    let cancelled = false;

    async function fetchTrainInfo() {
      setIsLoading(true);
      setError(null);
      setTrainInfo(null);
      setShowPassedStops(false);

      try {
        const result = await getTrainInformation(trainId!, date);
        if (!cancelled) {
          setTrainInfo(result.response);
        }
      } catch (err) {
        if (!cancelled) {
          console.error("Failed to fetch train information:", err);
          setError("Não foi possível carregar a informação do comboio.");
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    fetchTrainInfo();

    return () => {
      cancelled = true;
    };
  }, [trainId, date]);

  const isOpen = trainId !== null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Train className="h-5 w-5" />
            Comboio {trainId}
          </DialogTitle>
          <DialogDescription>Informação detalhada do comboio</DialogDescription>
        </DialogHeader>

        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <div className="flex flex-col items-center gap-2">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              <span className="text-sm text-muted-foreground">A carregar...</span>
            </div>
          </div>
        )}

        {error && (
          <div className="flex items-center justify-center py-8">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {!isLoading && !error && trainInfo === null && (
          <div className="flex items-center justify-center py-8">
            <p className="text-sm text-muted-foreground">
              Não foi encontrada informação para este comboio.
            </p>
          </div>
        )}

        {!isLoading && !error && trainInfo && (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">{trainInfo.TipoServico}</Badge>
              <Badge variant="outline">{trainInfo.Operador}</Badge>
              {trainInfo.DuracaoViagem && (
                <Badge variant="outline">Duração: {trainInfo.DuracaoViagem}</Badge>
              )}
            </div>

            {trainInfo.SituacaoComboio && (
              <div className="flex items-center gap-2 rounded-md bg-amber-50 border border-amber-200 p-3 text-sm text-amber-800">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <span>{trainInfo.SituacaoComboio}</span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Origem:</span>
                <p className="font-medium">{trainInfo.Origem}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Destino:</span>
                <p className="font-medium">{trainInfo.Destino}</p>
              </div>
            </div>

            {trainInfo.NodesPassagemComboio && trainInfo.NodesPassagemComboio.length > 0 && (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">Estado</TableHead>
                      <TableHead>Estação</TableHead>
                      <TableHead className="w-[80px]">Hora</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(() => {
                      const stops = trainInfo.NodesPassagemComboio;
                      const passedStops = stops.filter((s) => s.ComboioPassou);
                      const upcomingStops = stops.filter((s) => !s.ComboioPassou);
                      const shouldCollapse = stops.length > 6 && passedStops.length > 0;
                      const isCollapsed = shouldCollapse && !showPassedStops;

                      return (
                        <>
                          {isCollapsed ? (
                            <TableRow
                              className="cursor-pointer hover:bg-muted/50"
                              onClick={() => setShowPassedStops(true)}
                            >
                              <TableCell colSpan={3}>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <ChevronDown className="h-4 w-4" />
                                  <span>Mostrar estações anteriores</span>
                                </div>
                              </TableCell>
                            </TableRow>
                          ) : (
                            <>
                              {shouldCollapse && (
                                <TableRow
                                  className="cursor-pointer hover:bg-muted/50"
                                  onClick={() => setShowPassedStops(false)}
                                >
                                  <TableCell colSpan={3}>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                      <ChevronUp className="h-4 w-4" />
                                      <span>Ocultar estações anteriores</span>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              )}
                              {passedStops.map((stop, index) => (
                                <TableRow key={`${stop.NodeID}-${index}`} className="opacity-50">
                                  <TableCell>
                                    <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                                  </TableCell>
                                  <TableCell className="font-medium">{stop.NomeEstacao}</TableCell>
                                  <TableCell className="font-mono text-sm">
                                    {stop.HoraProgramada}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </>
                          )}
                          {upcomingStops.map((stop, index) => (
                            <TableRow key={`${stop.NodeID}-${index}`}>
                              <TableCell>
                                <Clock className="h-4 w-4 text-green-600" />
                              </TableCell>
                              <TableCell className="font-medium">{stop.NomeEstacao}</TableCell>
                              <TableCell className="font-mono text-sm">
                                {stop.HoraProgramada}
                              </TableCell>
                            </TableRow>
                          ))}
                        </>
                      );
                    })()}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
